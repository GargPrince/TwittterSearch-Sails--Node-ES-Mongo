var Promise = require('bluebird');
var client=require('./../../config/database').client;
var twitterClient = require('./../../config/database').twitterClient;
var fs=require('fs');
var writer= fs.createWriteStream(__dirname+'/../../sample.json');
var keywordGl='';

/**
 * TwitterAPI.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {

    elasticStore: function(tweetObj) {
              var bulk = [];
              var makebulk = function(tweetObj,callback){
                  
                for (var current in tweetObj){
                   tweetObj[current]['keywords'] = keywordGl;
                   tweetObj[current]['timeStamp'] = new Date();

                  writer.write(JSON.stringify(tweetObj[current]));
                bulk.push(
                  { index: {_index: 'twitter', _type: 'tweets', _id: tweetObj[current].id_str } }, JSON.stringify(tweetObj[current])
                );
              }
              callback(bulk);
            }

            var indexall = function(madebulk,callback) {
              client.bulk({
                maxRetries: 5,
                index: 'twitter',
                type: 'tweets',
                body: madebulk
              },function(err,resp,status) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    callback(resp.items);
                  }
              });
            }

            makebulk(tweetObj,function(response){
              console.log("Bulk content prepared");
              indexall(response,function(response){
                console.log("Prince Status is: "+JSON.stringify(response));
                
                return response;
              });
            });
},

    tweets: function(keyword,cb) {
      var overallResponse = {};
      keywordGl=keyword;
      var promise=new Promise(function(resolve, reject){
      twitterClient.get('search/tweets', {q: keyword, count: 10}, function(err, data){
        console.log("success twitter"+ data.statuses);
        resolve(data.statuses);
        });
      });

      promise.then( this.elasticStore ).then(function(){
        client.search({
                  index: 'twitter',
                  type: 'tweets',
                  body: {
                    query: {
                      regexp: { "keywords": keywordGl+".+" },
                      regexp: { "keywords": ".+"+keywordGl },
                      regexp: { "keywords": keywordGl }

                      //wild card
                      //wildcard: { "constituencyname": "+isbury" }

                      //regular expression
                      //regexp: { "constituencyname": ".+isb.+" } 
                    },
                  }
                },function (error, response, status) {
                    if (error){
                      console.log("search error: "+error)
                    }
                    else {
                      console.log("--- Response ---");
                      //res.end(JSON.stringify(response));
                      console.log("--- Hits ---");
                      cb(response.hits.hits);
                   
                     
                    }
                });
        

      });
      
    },

    countTotalTweet : function(cb) {
      client.count({index: 'twitter', type: 'tweets'},function(err,resp,status) {  
        if(err) console.log(err.toString());
        else if(!resp){
          console.log("0 result")
        }
        else {
          //This call back can do whatever we will pass to it. Multi purpose
          cb(resp.count);
        }
      });
    },

    deleteDoc: function() {
      this.countTotalTweet(function(count) {
        if(count > 0) {
          client.delete({  
            index: 'twitter',
            id: '1',
            type: 'tweets'
          },function(err,resp,status) {
              console.log("Delete Complete");
              console.log(resp);
          });
        }
      });
      
    }


  }


  
};
