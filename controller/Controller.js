

const {query} = require("./db.js");

//Handles db CRUD operations.
class Controller{
    constructor() {
        this.q = query;
    }

    /**
     *
     * @return
     */
    findUnclusteredSentences(){

    }

    /**
     * @return
     */
    reconstructFbEntry(){

    }

    /**
     * @param cluster
     */
    getAllSentences(cluster){

    }


    /**
     * Accept a cluster
     * @param cluster
     */
    setAccept(cluster){

    }

    /**
     * unaccept a cluster
     * @param cluster
     */
    setUnaccept(cluster){

    }

    /**
     * remove a sentence from a cluster
     * @param cluster
     * @param sentence
     */
    removeSentence(cluster, sentence){

    }

    /**
     * add a sentence to a cluster
     * @param cluster
     * @param sentence
     */
    addSentence(cluster, sentence){

    }

    /**
     * search on unclustered sentences to find specific sentences.
     * @param sentence
     */
    searchUnclustered(sentence){

    }

    /**
     * search on clusters to find specific clusters
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