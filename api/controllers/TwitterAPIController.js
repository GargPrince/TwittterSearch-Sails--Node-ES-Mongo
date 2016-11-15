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


// 'search': function(keyword, cb) {

// client.search({
//   index: 'twitter',
//   type: 'tweets',
//   body: {
    
//     query: {
//       match: { "keywords": "world cup" }

//       //wild card
//       //wildcard: { "constituencyname": "+isbury" }

//       //regular expression
//       //regexp: { "constituencyname": ".+isb.+" } 
//     },
//   }
// },function (error, response, status) {
//     if (error){
//       console.log("search error: "+error)
//     }
//     else {
//       console.log("--- Response ---");
//       //res.end(JSON.stringify(response));
//       console.log("--- Hits ---");
//       cb(response.hits.hits);
//     }
// });
// },

'tweets': function(req, res) {
  TwitterAPI.attributes.tweets(req.params.all().words, function(response){
    var date=new Date();
    //   MongoTwitter.insertOne({keyword: req.params.all().words, tweetCount: response.lenght, timestamp: date});
    //   MongoTwitter.findOne({keyword: req.params.all().words}).exec(function(err, result) {
    //     if(err) throw err;
    //     console.log("result"+JSON.stringify(result));
    //     console.log("Mongo result "+result.tweetCount);
    //   });
      res.render('displayTweets', {tweets: response});
      //console.log('\n\n\nresponse for all'+JSON.stringify(response));
    });
    // TwitterAPI.attributes.tweets(req.params.all().words, function(response){
    //   res.render('displayTweets', {tweets: JSON.stringify(response)});
    //   //console.log('\n\n\nresponse for all'+JSON.stringify(response));
    // });
   

},

'allTweetsAPI' : function(req, res) {
  TwitterAPI.attributes.allTweetsAPI(function(tweets) {
    res.end(tweets.length);
  });
},

"twitterBasicAnalytics": function(req, res) {
  TwitterAPI.attributes.allTweetsAPI(function(tweets){
      //For top ten persons who twitted the most
      var source = _.pluck(tweets, '_source');
      var users = _.pluck(source, 'user');
      var screename = _.pluck(users, 'screen_name'); 
      var occ = _.countBy(screename, _.identity);
      var sorted = _.chain(occ).
          map(function(cnt, user) {
              return {
                  username: user,
                  tweets: cnt
              }
          })
          .sortBy('tweets').reverse().slice(0, 10)
          .value();

          //For most Re
          var dateWise = _.sortBy(tweets, function(o) { return o.created_at; });
      res.render('displayTweets', {tweets: sorted});
    });

},

"tenPeopleTwittedMost": function(req, res) {
  TwitterAPI.attributes.allTweetsAPI(function(tweets){
      var source = _.pluck(tweets, '_source');
      var users = _.pluck(source, 'user');
      var screename = _.pluck(users, 'screen_name'); 
      var occ = _.countBy(screename, _.identity);
      var sorted = _.chain(occ).
          map(function(cnt, user) {
              return {
                  username: user,
                  tweets: cnt
              }
          })
          .sortBy('tweets').reverse().slice(0, 10)
          .value();
      res.render('displayTweets', {tweets: sorted});
    });

},

'mostRecentTweets': function(req, res) {
   TwitterAPI.attributes.allTweetsAPI(function(tweets){
      var dateWise = _.sortBy(tweets, function(o) { return o.created_at; });
      res.render('displayTweets', {tweets: dateWise});
    });
},

'leastRecentTweets': function(req, res) {
    TwitterAPI.attributes.allTweetsAPI(function(tweets){
      var dateWise = _.sortBy(tweets, function(o) { return o.created_at; }).reverse();
      res.render('displayTweets', {tweets: dateWise});
    });
},


//having problem
'sortByFollowers': function(req, res) {
 TwitterAPI.attributes.allTweetsAPI(function(tweets){
      var followerSorted = _.sortBy(tweets, function(o) { return o._source.user.followers_count; }).reverse();
      res.render('displayTweets', {tweets: followerSorted});
    });

},

'delete': client.indices.delete({index: 'twitter'},function(err,resp,status) {  
  console.log("delete",resp);
})

};

