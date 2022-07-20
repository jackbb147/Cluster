require('dotenv').config()
const helpers = require("./helperMethods");
const print = helpers.print;
const mysql = require('mysql2/promise');
const config = require('./config.js').config;
const express = require("express");
const app = express();
const port = process.env.PORT || 1700;
const TABLENAMES = ["feedback_clusters", "feedback_sentences", "sentence_cluster_mapping"]
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.send("hello!")
});

async function main(){

    print("mysql connection established: ", connection);
}



async function query(sql, params) {

    const [results, ] = await connection.execute(sql, params);
    return results;
}

app.listen(port, async () => {
    const tables = TABLENAMES;
    const query =  `SELECT * FROM ${tables[0]}`;
    print("line 34: hello world!", query);
    const connection = await mysql.createConnection(config.db);
    const results = await connection.execute(
        query
    )
    print(results);

})
