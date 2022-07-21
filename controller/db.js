
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

async function query() {
    const connection = await mysql.createConnection(config.db);
    return connection.execute.bind(connection);
}


module.exports = {query};


