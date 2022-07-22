
//connect to the db
//return: the connection object
const mysql = require("mysql2/promise");
const {config} = require("../config");


// async function f(sql, params){
//     return await connection.execute(sql, params);
// }
//
// return f;
// // const [results, ] = await connection.execute(sql, params);
// // return results;

/**
 * Establishes connection to the database using provided credentials,
 * promising to return a function that can be used to execute queries through
 * the established connection.
 *
 * @return Function
 *          that takes in two parameters: sql string and sql parameters,
 *              and returns the result of the query.
 *
 */
async function query() {
    // Establishing connection
    const connection = await mysql.createConnection(config.db);
    const addIndex = `CREATE INDEX idx_cluster_id ON sentence_cluster_mapping (cluster_id);`;
    // const dropIndex = `DROP INDEX idx_feedback_entry_id ON feedback_sentences`;

    // await connection.execute(addIndex);
    // Preparing the execute method of the established connection
    var f = connection.execute.bind(connection);
    return async (sql, params)=> {
        const [results, ] = await f(sql, params);
        return results;
    }
}


module.exports = {query};


