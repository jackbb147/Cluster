

const {query} = require("./db.js");
const TABLENAMES  = ["feedback_clusters", "feedback_sentences", "sentence_cluster_mapping"]


//Handles all operations to the database.
class Controller{
    constructor() {
        this.q = query;
        this.clustersTableName = TABLENAMES[0];
        this.sentencesTableName = TABLENAMES[1];
    }

    /**
     * gets a whole table
     * @param n 0, 1, 2
     * @return {Promise<void>}
     */
    async getTable(n){
        const table = await query(`SELECT * FROM ${TABLENAMES[n]}`);
        return table;
    }

    /**
     * get all the clusters from the feedback_clusters table in db.
     *
     * @return [ { id: Number, title: String, accepted: Number, miscellaneous } ]
     */
    async getAllClusters(){
        console.log("getAllClusters called!");
        //TODO
        const table = await(this.getTable(0));
        return table;
    }


    /**
     * get all the sentences from the feedback_sentences table in db.
     *
     * @return [ { id: Number sentence_text: String, order_within_feedback_entry: Number, feedback_entry_id: Number } ]
     */
    async getAllSentences(){
        console.log("getAllSentences called!");
        const table = await(this.getTable(1));
        return table;
    }

    /**
     * gets all the sentence-cluster mappings
     * @return
     */
    async getAllMappings(){
        console.log("getAllMappings called!");
        const table = await(this.getTable(2));
        return table;
    }

    /**
     * checks if a cluster with the given ID exists.
     * @param id id of cluster
     * @return Boolean
     */
    async clusterExists(id){
        return (await this.getCluster(id)).length > 0;
    }

    /**
     * helper method to select from the given table where id is the given ID
     * @param tableName
     * @param id
     * @return Array
     */
    async selectWithID(tableName, id){
        const queryString = `SELECT * FROM ${tableName} WHERE id = ${id}`;
        return await query(queryString);
    }

    /**
     * gets a cluster from a given ID.
     * @param id
     * @return Array of clusters (length could be 0)
     */
    async getCluster(id){
        // const queryString = `SELECT * FROM ${this.clustersTableName} WHERE id = ${id}`;
        // return await query(queryString);

        return this.selectWithID(this.clustersTableName, id);
    }



    /**
     * accept/unaccept a cluster wit the given ID.
     * @param clusterID
     * @param accept Number 0 or 1
     * @return Number: 0 for success; else is failure
     */
    async setAccepted(clusterID, accept){
        const queryString = `UPDATE ${this.clustersTableName} SET accepted = ${accept} WHERE id = ${clusterID}`;
        await query(queryString);
        return 0;
    }

    /**
     * return sentences with the given ID
     * @param sentenceID
     * @return Array of sentences
     */
    async getSentence(sentenceID){
        return this.selectWithID(this.sentencesTableName , sentenceID);
    }

    /**
     * returns an array of all sentences in the given cluster
     * @param cluster
     * @return Array
     */
    async getAllSentencesFrom(cluster){
        
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