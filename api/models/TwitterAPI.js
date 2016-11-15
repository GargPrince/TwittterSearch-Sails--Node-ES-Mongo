//Importing Packages
var Promise = require('bluebird');

//Requirement for configuration of our databases and twitter api
var config=require('./../../config/databaseConfig');
var esClient=config.ESClient;
var mongoClient=config.MongoClient;
var twitterClient = config.twitterClient;

var keywordGl='';
var url = 'mongodb://localhost:27017/twitter'; //mongo URL : you can select your DB by replacing 'twitter' from this URL2

/**
 * TwitterAPI.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {

//Fetch all tweets from Elastic search
    allTweetsAPI: function(callbackTweets) {
              esClient.search({
                  index: 'twitter',
                  type: 'tweets',
                  body: {
                    //We defined the limit maximum records to be fetched from ES
                    from:0, size:5000, 
                    //query to get whole data inside index
                    query: {
                      match_all: {}
                      
                    },
                  }
                },function (error, response, status) {
                    if (error){
                      throw error;
                    }
                    else {
                      callbackTweets(response.hits.hits);
                   
                    }
                });
},

//search for tweets from TWITTER API and storing in ES
    searchTweets: function(keyword,dataByCallback) {
      var overallResponse = {};
      keywordGl=keyword;
      var promise=new Promise(function(resolve, reject){
        //query by keyword to twitter API and limit count to 100
      twitterClient.get('search/tweets', {q: keyword, count: 100}, function(err, data){
        // console.log("success twitter"+ data.statuses);
        console.log('\n\n\n\nResponse twitter length--->'+ data.statuses.length);
        resolve(data.statuses);
        });
      });
// Using promises instead of callbacks
      promise.then( function(res){

          var tweetObj = res;
          var bulk = [];
              var makebulk = function(tweetObj,callback){
          //pushing into array        
                for (var current in tweetObj){
                bulk.push(
                  { index: {_index: 'twitter', _type: 'tweets', _id: tweetObj[current].id_str } }, JSON.stringify(tweetObj[current])
                );
              }
              callback(bulk);
            }

            var indexall = function(madebulk,callback) {
              esClient.bulk({
                maxRetries: 5,
                index: 'twitter',
                type: 'tweets',
                body: madebulk
              },function(err,resp,status) {
                  if (err) {
                    throw err;
                  }
                  else {
                    callback(resp.items);
                  }
              });
            }
// Calling makebulk to prepare our bulk array of JSON and query ES for bulk store by calling indexall()
            makebulk(tweetObj,function(response){
              indexall(response,function(response){
                  esClient.search({
                  index: 'twitter',
                  type: 'tweets',
                  body: {
                    //We defined the limit maximum records to be fetched from ES
                    from:0, size:5000,
                    //query by regexp to get different compbination of matching data for ES
                    query: {
                      regexp: { "text": ".+"+keywordGl+".+" },
                      regexp: { "text": keywordGl+".+" },
                      regexp: { "text": ".+"+keywordGl },
                      regexp: { "text": keywordGl }
                      
                    },
                  }
                },function (error, response, status) {
                    if (error){
                      throw error;
                    }
                    else {
                      //giving data by callback
                      dataByCallback(response.hits.hits);
                    }
                });
              });
            });
      
      });
      
    },

//Query to save data in MongoDB
    mongoDBSave: function(keyword, tweetCount) {
      mongoClient.connect(url, function(err, db) {
        db.collection('tweetinfo').insertOne( {
      "keywords" : keyword,
      "timeStamp" : new Date(),
      "tweetCount" : tweetCount
   }, function(err, result) {
    if(err) throw err;
    else if(!result) console.log("nO MONGO INSERTION");
    else console.log("MONGO INSERTION");
    db.close();
  });
    
      });
    },
//Query to find data form MongoDB
    showMongoData: function(mongoCallback) {
      mongoClient.connect(url, function(err, db) {
        db.collection('tweetinfo').find({}).toArray(function(err, items) {
        mongoCallback(items);
        db.close();
        });
    });

    }


  }


  
};
