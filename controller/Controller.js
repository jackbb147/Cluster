


const TABLENAMES  = ["feedback_clusters", "feedback_sentences", "sentence_cluster_mapping"]

//ASSUMPTIONS: 1. No two sentences share the same ID.
//Handles all operations to the database.
class Controller{
    /**
     *
     * @param query function with two parameters: sql string, sql params
     */
    constructor(query) {
        // console.log("query: ", query());
        this.query = query;
        this.clustersTableName = TABLENAMES[0];
        this.sentencesTableName = TABLENAMES[1];
        this.mappingsTableName = TABLENAMES[2];
    }

    /**
     * gets a whole table, with an optional filter on some column (JUST ONE COLUMN ONLY. Maybe in the future add support for multiple columns).
     * @param n 0, 1, 2 corresponds to the 3 tables in the database.
     * @param filter  (optional) { columnName: , columnValue: [word1, word2, ...] },
     *          will match the columns with values LIKE columnValue
     * @return {Promise<void>}
     */
    async getTable(n, filter){
        // -------- optional ----------
        var searchFilter = ``;
        if(filter) {
            searchFilter = ` WHERE `;
            let columnName = filter.columnName;
            filter.columnValue.forEach((value, index) => {
                if(index > 0) searchFilter += ` OR `;
                searchFilter += `${columnName} LIKE '%${value}%'`
            })
            // ${filter.columnName} LIKE '%${filter.columnValue}%'`;
        }

        // ----------------------------
        const table = await this.query(`SELECT * FROM ${TABLENAMES[n]} ${searchFilter}`);
        return table;
    }

    /**    /** TODO needs refactoring to promise
     * get all the clusters from the feedback_clusters table in db.
     * @param keywords optional keyword filter on cluster title.
     * @return [ { id: Number, title: String, accepted: Number, miscellaneous } ]
     */
    async getAllClusters(keywords){
        console.log("getAllClusters called!");
        var filter;
        if(keywords) filter = {
            columnName: "title",
            columnValue: [keywords]
        }
        //TODO
        const table = await(this.getTable(0, filter));
        return table;
    }


    /**    /** TODO needs refactoring to promise
     * get all the sentences from the feedback_sentences table in db.
     *
     * @return [ { id: Number sentence_text: String, order_within_feedback_entry: Number, feedback_entry_id: Number } ]
     */
    async getAllSentences(){
        console.log("getAllSentences called!");
        const table = await(this.getTable(1));
        return table;
    }

    /**    /** TODO needs refactoring to promise
     * gets all the sentence-cluster mappings
     * @return
     */
    async getAllMappings(){
        console.log("getAllMappings called!");
        const table = await(this.getTable(2));
        return table;
    }

    /**    /** TODO needs refactoring to promise
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
     * @return Promise<Array>
     */
    async selectWithID(tableName, id){
        return this.selectWithColumn(tableName, "id", id);
    }

    /**
     * get all the fields of the documents with the right column value
     * @param tableName
     * @param columnName
     * @param columnValue
     * @return {Promise<Array>}
     */
    async selectWithColumn(tableName , columnName, columnValue){
        const queryString = `SELECT * FROM ${tableName} WHERE ${columnName} = ${columnValue}`;
        return this.query(queryString);
    }

    /**
     * get particular(as opposed to all)  fields of the documents with the right column value
     * @param tableName
     * @param columnName
     * @param columnValue
     * @param wantedColumn
     * @return {Promise<>}
     */
    async selectSomeWithColumn(tableName, columnName, columnValue, ...wantedColumn){

        const wantedColumns = wantedColumn.join(",");
        const queryString = `SELECT ${wantedColumns} FROM ${tableName} WHERE ${columnName} = ${columnValue}`;
        return this.query(queryString);
    }

    /**
     * gets a cluster from a given ID.
     * @param id
     * @return Array of clusters (length could be 0)
     */
    async getCluster(id){

        return this.selectWithID(this.clustersTableName, id);
    }



    /**    /** TODO needs refactoring to promise
     * accept/unaccept a cluster wit the given ID.
     * @param clusterID
     * @param accept Number 0 or 1
     * @return Number: 0 for success; else is failure
     */
    async setAccepted(clusterID, accept){
        const queryString = `UPDATE ${this.clustersTableName} SET accepted = ${accept} WHERE id = ${clusterID}`;
        await this.query(queryString);
        return 0;
    }

    /**
     * return sentences with the given ID
     * @param sentenceID
     * @return Promise<Array>
     */
    async getSentence(sentenceID){
        return this.selectWithID(this.sentencesTableName , sentenceID);
    }

    /** TODO needs refactoring to promise
     * returns an array of IDs of all sentences in the given cluster
     * @param clusterID
     * @return Array
     */
    async getSentencesFromCluster(clusterID){
        const   columnName = "cluster_id",
                columnValue = clusterID;

        console.log("Controller.js 132: ", columnName, columnValue);
        const mappings = await this.selectSomeWithColumn(
            this.mappingsTableName, columnName, columnValue,
            "id", "sentence_id", "cluster_id"
        );
        console.log("Controller.js 134: ", mappings);
        var ans = [];

        for(var i = 0; i < mappings.length; i++){
            const mapping = mappings[i];
            let sentenceID = mapping.sentence_id;
            ans.push(sentenceID);
        }
        return ans;
    }

    /**
     * find all sentences from a given feedback entry
     * @param fbID id of the feedback entry
     * @return Promise<Array>
     */
    async getSentencesFromFeedback(fbID){
        // const sentences = await this.selectWithColumn(this.sentencesTableName, "feedback_entry_id", fbID);
        const sentences = this.selectSomeWithColumn(
            this.sentencesTableName, "feedback_entry_id", fbID,
            "id", "sentence_text", "order_within_feedback_entry", "feedback_entry_id"
        )
        return sentences;
    }

    /** ! MODEL FOR REFACTORING INTO PROMISES
     * for each sentence associated to a cluster, reconstruct its feedback entry.
     * returns the whole thing
     * @param clusterID
     * @return
     */
    async getFeedbacksFromCluster(clusterID){
        console.log("CLUSTERID: ", clusterID)
        const IDs = await this.getSentencesFromCluster(clusterID);
        console.log(IDs);
        var fbEntryPromises = [];
        //FIRE UP A BUNCH OF CONNECTIONS SIMULTANEOUSLY SO THAT
        //MULTIPLE QUERIES CAN BE DONE AT ONCE.
        for( const id of IDs) {
            // fbEntries.push(await this.reconstructFbEntry(id));
            fbEntryPromises.push(this.reconstructFbEntry(id));
        }
        return Promise.all(fbEntryPromises);
    }

    /**
     * reconstructs a feedback entry, given any of its sentences
     *
     * @param sentenceID
     * @return String, with the format being "text$id" where id is the feedback id.
     */
    async reconstructFbEntry( sentenceID ){
        const sentence = (await this.getSentence(sentenceID))[0];   //see ASSUMPTIONS above
        if(sentence === undefined) return;                          //no sentence found.
        var fbID;                 // feedback ID
        try {
            fbID = sentence.feedback_entry_id;
        }catch (e) {
            console.log(e, "sentence: ", sentence, "sentenceID: ", sentenceID); //TODO :handle this when sentenceID is bogus(not in the sentences table)
            return;
        }
        var sentences = await this.getSentencesFromFeedback(fbID);  // sentence object
        var sentencetexts = [];

        // 1. SORT by order
        sentences = sentences.sort(
            (a,b) => a.order_within_feedback_entry - b.order_within_feedback_entry
        );
        // 2. grab the texts
        sentences.forEach(sentence => {sentencetexts.push(sentence.sentence_text)});

        // 3. merge and return
        return sentencetexts.join('')+'$'+sentenceID;
    }

    /**    /** TODO needs refactoring to promise
     * find a sentence from a cluster.
     * @param clusterID
     * @param sentenceID
     * @return Array: if empty, sentence not in cluster.
     */
    async findSentenceInCluster(clusterID, sentenceID){
        //TODO
        const queryString = `SELECT * FROM ${this.mappingsTableName} 
                                WHERE cluster_id = ${clusterID} 
                                AND sentence_id = ${sentenceID}`;
        return await this.query(queryString);
    }


    /**    /** TODO needs refactoring to promise
     * remove a sentence from a cluster
     * @param clusterID
     * @param sentenceID
     * @return Number: 0 for success
     */
    async removeSentence(clusterID, sentenceID){
        const queryString = `DELETE FROM ${this.mappingsTableName} 
                            WHERE cluster_id = ${clusterID} 
                            AND sentence_id = ${sentenceID}`;
        await this.query(queryString);
        return 0;
    }



    /**
     * find the sentences that are not in any cluster.
     * @param keywords: (optional)array of keywords(String) that the sentence must contain.
     * @return {Promise<Array>}
     */
    async getUnclusteredSentences(keywords = []){

        //------------ optional: this search filter will look for keywords.  -----
        var searchFilter = `AND ( `;
        keywords.forEach((word, index) => {
            if(index > 0) searchFilter += ` OR `;
            searchFilter += `t1.sentence_text LIKE '%${word}%'`;
        })
        searchFilter += ` ) `;
        console.log("Controller 279: ", searchFilter);
        if(keywords.length < 1) searchFilter = ``;

        //------------
        const queryString = `
            SELECT t1.id 
            FROM ${this.sentencesTableName} t1 
            LEFT JOIN ${this.mappingsTableName} t2 ON t2.sentence_id = t1.id 
            WHERE t2.sentence_id IS NULL ${searchFilter}
        `;

        return this.query(queryString);
    }

    /**    /** TODO needs refactoring to promise
     * given an array of sentence ID's, return the ones that can be found in the sentences table.
     * @param IDs Array
     * @return arr
     */
    async getAvailableSentences(IDs){

    }


    /**    /** TODO needs refactoring to promise
     * add a sentence to a cluster
     * @param clusterID
     * @param sentenceID
     * @return
     */
    async addSentenceToCluster(clusterID, sentenceID){
        const queryString = `
            INSERT INTO ${this.mappingsTableName} 
                    ( sentence_id , cluster_id )
            VALUES  (${sentenceID}, ${clusterID}) 
        `;

        return await this.query(queryString);
    }



    /**    /** TODO needs refactoring to promise
     * see if the given sentence doesn't have a cluster
     * @param sentenceID
     * @return Boolean
     */
    async isUnclustered(sentenceID){
        //TODO
    }







    /**    /** TODO needs refactoring to promise
     * search on unclustered sentences to find specific sentences.
     * FRONT END
     * @param sentence
     */
    searchUnclustered(sentence){

    }


    /**    /** TODO needs refactoring to promise
     * search on clusters to find specific clusters
     * FRONT END
     * @param cluster
     */
    searchClusters(clusters){

    }

    /**    /** TODO needs refactoring to promise
     * filter between all clusters, accepted clusters, and unaccepted clusters.
     * @param n
     */
    filter(n){

    }




}

module.exports = {Controller}