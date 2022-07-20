require('dotenv').config()
const helpers = require("./helperMethods");
const print = helpers.print;
const prettyPrintJson = require('pretty-print-json').prettyPrintJson;
const query = require("./controller/db.js").query;
const {Controller}  = require("./controller/Controller.js");
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

const controller = new Controller();


app.listen(port, async () => {
    print(`APP LISTENING ON PORT ${port}`)
})

app.get("/", async (req, res) => {
    const tables = TABLENAMES;
    const qStr1 =  `SELECT * FROM ${tables[0]}`;
    const qStr2 =  `SELECT * FROM ${tables[1]}`;
    const qStr3 =  `SELECT * FROM ${tables[2]}`;

    const results1 = await query(qStr1);
    const results2 = await query(qStr2);
    const results3 = await query(qStr3);

    res.send(`<pre>${prettyPrintJson.toHtml(results1)}</pre> <br>`);
});

app.get("/api/clusters", async (req, res) => {

    const clusters = await controller.getAllClusters();
    res.send(`<pre>${prettyPrintJson.toHtml(clusters)}</pre> <br>`);
})


