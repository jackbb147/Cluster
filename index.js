require('dotenv').config()
const {print, printJSON} = require("./helperMethods");
const {Controller}  = require("./controller/Controller.js");
// const mysql = require('mysql2/promise');
// const config = require('./config.js').config;
// const connect = require("./controller/db").connect;
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


    res.send("/api + one of the following: /clusters, /sentences, /mappings");
});

app.get("/api/clusters", async (req, res) => {

    const result = await controller.getAllClusters();
    res.send(printJSON(result));
})

app.get("/api/sentences", async (req, res) => {
    console.log("getting sentences");
    const result = await controller.getAllSentences();
    res.send(printJSON(result));
})

app.get("/api/mappings", async (req, res) => {
    console.log("getting sentences");
    const result = await controller.getAllMappings();
    res.send(printJSON(result));
})

app.get("/api/existCluster/:id", async(req, res) => {
    const result = await controller.clusterExists(req.params.id);
    console.log(result);
    res.send(printJSON(result));
})

app.get("/api/cluster/:id", async(req, res) => {

    const result = await controller.getCluster(req.params.id);
    console.log(result);
    res.send(printJSON(result));
})

//could change this to a post request later.
app.get("/api/acceptcluster/:id", async(req, res) => {
    const id = req.params.id;
    const result = await controller.setAccepted(id, 1);
    console.log(result);
    // res.send(printJSON(result));
    res.redirect(`/api/cluster/${id}`)
})

app.get("/api/unacceptcluster/:id", async(req, res) => {
    const id = req.params.id;
    const result = await controller.setAccepted(req.params.id, 0);
    console.log(result);
    // res.send(printJSON(result));
    res.redirect(`/api/cluster/${id}`)
})

app.get("/api/sentence/:id", async(req, res) => {

    const result = await controller.getSentence(req.params.id);
    console.log(result);
    res.send(printJSON(result));
})

app.get("/api/clustersentence/:id", async(req, res) => {

    const result = await controller.getSentencesFromCluster(req.params.id);
    console.log(result);
    res.send(printJSON(result));
})

app.get("/api/sentencetofeedback/:sentenceid", async(req, res) => {

    const result = await controller.reconstructFbEntry(req.params.sentenceid);
    console.log(result);
    res.send(printJSON(result));
})










