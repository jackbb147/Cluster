require('dotenv').config()
const helpers = require("./helperMethods");
const print = helpers.print;
const query = require("./controller/db.js").query;
const mysql = require('mysql2/promise');
const config = require('./config.js').config;
const connect = require("./controller/db").connect;
const express = require("express");
const app = express();
const port = 1700;
const TABLENAMES = ["feedback_clusters", "feedback_sentences", "sentence_cluster_mapping"]
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);






app.listen(port, async () => {
    print(`APP LISTENING ON PORT ${port}`)
})

app.get("/", async (req, res) => {
    const tables = TABLENAMES;
    const qStr =  `SELECT * FROM ${tables[0]}`;


    const results = await query(qStr)
    res.json(results);
});
