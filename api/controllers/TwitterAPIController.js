/**
 * TwitterAPIController
 *
 * @description :: Server-side logic for managing twitterapis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var client=require('./../../config/database').client;
module.exports = {
	'new': function(req, res) {
        res.end("Hi Prince I am running");
    },

'tweetInfo': function(req, res) {
  

},


'search': function(keyword, cb) {

client.search({
  index: 'twitter',
  type: 'tweets',
  body: {
    
    query: {
      match: { "keywords": "world cup" }

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
},

'tweets': function(req, res) {
  this.search(req.params.all().words, function(response){
      res.render('displayTweets', {tweets: response});
      //console.log('\n\n\nresponse for all'+JSON.stringify(response));
    });
    // TwitterAPI.attributes.tweets(req.params.all().words, function(response){
    //   res.render('displayTweets', {tweets: JSON.stringify(response)});
    //   //console.log('\n\n\nresponse for all'+JSON.stringify(response));
    // });
   

}


};

