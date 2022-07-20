

const {query} = require("./db.js");
const TABLENAMES  = ["feedback_clusters", "feedback_sentences", "sentence_cluster_mapping"]


//Handles all operations to the database.
class Controller{
    constructor() {
        this.q = query;
    }

    /**
     * get all the clusters from the feedback_clusters table in db.
     *
     * @return [ { id: String, title: String, accepted: Number, miscellaneous } ]
     */
    async getAllClusters(){
        console.log("getAllClusters called!");
        //TODO
        var arr = [];
        const qryString =  `SELECT * FROM ${TABLENAMES[0]}`;
        arr = await query(qryString);
        return arr;
    }

    /**
     * Accept a cluster
     * @param cluster
     * @return Number: 0 for success; else is failure
     */
    async setAccept(cluster){

    }

    /**
     * unaccept a cluster
     * @param cluster
     * @return Number: 0 for success; else is failure
     */
    async setUnaccept(cluster){

    }

    /**
     * remove a sentence from a cluster
     * @param cluster
     * @param sentence
     * @return Number: 0 for success; else is failure
     */
    async removeSentence(cluster, sentence){

    }


    /**
     * add a sentence to a cluster
     * @param cluster
     * @param sentence
     * @return Number: 0 for success; else is failure
     */
    async addSentence(cluster, sentence){

    }

    /**
     * Given a list of all sentences, find the unclustered ones.
     * @param sentences
     *
     * @return Number: 0 for success; else is failure
     */
    async getUnclusteredSentences(sentences){

    }

    /**
     * reconstructs a feedback entry from its sentences.
     *
     * @param order
     * @param feedbackID
     * @param sentences
     * @return String
     */
    async reconstructFbEntry(order, feedbackID, sentences ){

    }

    /**
     * returns an array of all sentences in the given cluster
     * FRONT END
     * @param cluster
     * @return Array
     */
    async getAllSentences(cluster){

    }








    /**
     * search on unclustered sentences to find specific sentences.
     * FRONT END
     * @param sentence
     */
    searchUnclustered(sentence){

    }


    /**
     * search on clusters to find specific clusters
     * FRONT END
     * @param cluster
     */
    searchClusters(clusters){

    }

    /**
     * filter between all clusters, accepted clusters, and unaccepted clusters.
     * @param n
     */
    filter(n){

    }




}

module.exports = {Controller}