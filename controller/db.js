
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

    // Preparing the execute method of the established connection
    var f = connection.execute.bind(connection);
    return async (sql, params)=> {
        const [results, ] = await f(sql, params);
        return results;
    }
}


module.exports = {query};


