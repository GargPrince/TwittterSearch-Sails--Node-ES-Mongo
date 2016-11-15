/**
 * TwitterAPIController
 *
 * @description :: Server-side logic for managing twitterapis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//

module.exports = {


/*Gives the requested tweets to the user by user defined keywords
Save keyword, timestamp and result count in MongoDB*/

'searchTweets': function(req, res) {

    /*call function present in TwitterAPI model for querying
    check if user requested by keyword*/
    
    if(req.params.all().words) {
  TwitterAPI.attributes.searchTweets(req.params.all().words, function(response){
        TwitterAPI.attributes.mongoDBSave(req.params.all().words, response.length);
      res.render('displayTweets', {tweets: response}); //res.render is used for using tampelates
    });
    }
    else {
        res.render("404"); //otherwise, Go to 404.ejs tempelate
    }

},


//Gives the Total documents present in our elastic search
'allTweetsAPICount' : function(req, res) {

    //call function present in TwitterAPI model for querying
  TwitterAPI.attributes.allTweetsAPI(function(tweets) {
    res.end(tweets.length.toString());
  });
},

//Gives Top ten users who have tweeted the most
"tenPeopleTwittedMost": function(req, res) {

    //call function present in TwitterAPI model for querying
  TwitterAPI.attributes.allTweetsAPI(function(tweets){
      var source = _.pluck(tweets, '_source');
      var users = _.pluck(source, 'user');
      var screename = _.pluck(users, 'screen_name'); 
      var occ = _.countBy(screename, _.identity);
      
      //sort and slice it to get only 10 values
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

//Gives most recent tweets
'mostRecentTweets': function(req, res) {

    //call function present in TwitterAPI model for querying
   TwitterAPI.attributes.allTweetsAPI(function(tweets){
      var dateWise = _.sortBy(tweets, function(o) { return o.created_at; });
      res.render('displayTweets', {tweets: dateWise});
    });
},


//Gives least recent tweets
'leastRecentTweets': function(req, res) {

    //call function present in TwitterAPI model for querying
    TwitterAPI.attributes.allTweetsAPI(function(tweets){
      var dateWise = _.sortBy(tweets, function(o) { return o.created_at; }).reverse();
      res.render('displayTweets', {tweets: dateWise});
    });
},

//Filter-Sort tweets by user Followers
'sortByFollowers': function(req, res) {

    //call function present in TwitterAPI model for querying
 TwitterAPI.attributes.allTweetsAPI(function(tweets){
      var followerSorted = _.sortBy(tweets, function(o) { return o._source.user.followers_count; }).reverse();
      res.render('displayTweets', {tweets: followerSorted});
    });

},

//Show whole data in present in the mongoDB about the search
'showMongoData' : function(req, res) {

    //call function present in TwitterAPI model for querying
    TwitterAPI.attributes.showMongoData(function(mongoTweets) {
        res.render('displayTweets', {tweets: mongoTweets});
    });
}

};

