const PRODUCTION = true;

require('dotenv').config()
const queryFactory = require("./controller/db.js").queryFactory;
const {print, printJSON} = require("./helperMethods");
const {Controller}  = require("./controller/Controller.js");
const express = require("express");
const app = express();
const port = 1700;
const cors = require("cors")
app.use(cors())
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

Promise.resolve(queryFactory()).then(async f => {
    print(f)
    const controller = new Controller(f);

    app.listen(port, async () => {
        print(`APP LISTENING ON PORT ${port}`)
        print("controller query: ", controller.query)
    })


    /**
     * helper function for debugging purposes.
     * set PRODUCTION to false when debugging.
     */
    function process(obj){
        return PRODUCTION ? obj : printJSON(obj);
    }




    app.get("/", async (req, res) => {

        res.send("/api + one of the following: /clusters, /sentences, /mappings");
    });

    /**
     * returns ALL clusters, with an optional keyword filter(separated by ampersand) on the cluster title.
     */
    app.get("/api/clusters/:keywords?", async (req, res) => {
        let keywords = [];
        if(req.params.keywords) keywords = req.params.keywords.split("&");
        const result = await controller.getAllClusters(keywords);
        res.send(process(result));
    })

    app.get("/api/sentences", async (req, res) => {
        console.log("getting sentences");
        const result = await controller.getAllSentences();
        res.send(process(result));
    })

    app.get("/api/mappings", async (req, res) => {
        console.log("getting sentences");
        const result = await controller.getAllMappings();
        res.send(process(result));
    })

    app.get("/api/existCluster/:id", async(req, res) => {
        const result = await controller.clusterExists(req.params.id);
        console.log(result);
        res.send(process(result));
    })

    app.get("/api/cluster/:id", async(req, res) => {

        const result = await controller.getCluster(req.params.id);
        console.log(result);
        res.send(process(result));
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

    /**
     * GET THE SENTENCE WITH THE GIVEN ID.
     */
    app.get("/api/sentence/:id", async(req, res) => {

        const result = controller.getSentence(req.params.id);
        result.then(arr => {
            console.log("index.js 101: ", arr);
            res.send(process(arr));
        })
    })

    app.get("/api/clustersentence/:id", async(req, res) => {

        const result = await controller.getSentencesFromCluster(req.params.id);
        console.log(result);
        res.send(process(result));
    })

    app.get("/api/sentencetofeedback/:sentenceid", async(req, res) => {

        const result = await controller.reconstructFbEntry(req.params.sentenceid);
        console.log(result);
        res.send(process(result));
    })


//NOTE: /removesentece/123/321
    /**
     * REMOVE A SENTENCE FROM A CLUSTER
     */
    app.get("/api/removesentence/:clusterid/:sentenceid", async(req, res) => {
        const clusterID = req.params.clusterid,
            sentenceID = req.params.sentenceid;


        const result = await controller.removeSentence(clusterID, sentenceID);
        // console.log(result);
        res.send(true);
    })


    /**
     * GET THE ID's OF ALL UNCLUSTTERED SENTENCES
     * RETURN FORMAT: [ {id: }, ... ]
     * @param keywords word1&word2&word3&...
     * @return Promise<Array>
     */
    app.get("/api/unclusteredsentences/:keywords?", async(req, res) => {
        var keywords = [];
        if(req.params.keywords) keywords = req.params.keywords.split("&");
        print("142: ", keywords);
        const result = controller.getUnclusteredSentences(keywords);
        console.log(result);
        result.then(arr => {
            console.log("index.js 133: ", arr);
            res.send(process(arr));
        })
    })



//NOTE: /removesentece/123/321

    /**
     * ADD A SENTENCE TO A CLUSTER.
     */
    app.get("/api/addsentence/:clusterid/:sentenceid", async(req, res) => {
        const clusterID = req.params.clusterid,
            sentenceID = req.params.sentenceid;


        const result = await controller.addSentenceToCluster(clusterID, sentenceID);
        console.log(result);
        res.send(process(result));
    })


    /**
     * GET THE FEEDBACKS ASSOCIATED WITH A CLUSTER.
     */
    app.get("/api/clusterfeedbacks/:id", async(req, res) => {

        const result = controller.getFeedbacksFromCluster(req.params.id);
        console.log("index.js 149, result : ", result);
        result.then(values => {
            console.log("index.js 151: ", values);
            res.send(values);
        })
    })



});


