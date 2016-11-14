/**
 * TwitterAPIController
 *
 * @description :: Server-side logic for managing twitterapis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var client=require('./../../config/database').client;
var inputfile = require("./../../constituencies.json");
module.exports = {
	'new': function(req, res) {
        res.end("Hi Prince I am running");
    },

'tweetInfo': function(req, res) {
  

},


'search': function(req, res) {

client.search({
  index: 'twitter',
  type: 'tweets',
  body: {
    fields : ["user.name"],
    query: {
      regexp: { "id_str": ".+65893185.+" }

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
      res.end(JSON.stringify(response));
      console.log("--- Hits ---");
      response.hits.hits.forEach(function(hit){
        console.log(hit);
      })
    }
});
},

'tweets': function(req, res) {
  var tTweet;
  var topTen;
    TwitterAPI.attributes.tweets(req.params.all().words, function(response){
      console.log('\n\n\nresponse for all'+JSON.stringify(response));
    });
   

//TwitterAPI.attributes.search(req.params.all().words);
}


};

