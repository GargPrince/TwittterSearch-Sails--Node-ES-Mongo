# TwittterSearch-Sails--Node-ES-Mongo


This is a Node JS app to demonstrate fetching of tweets from Twitter API and storing it in Elastic Search using sails.js.

## Requirements

- node, npm, ElasticSearch, MongoDB

## Usage

1. Clone the repo: `git clone git@github.com:GargPrince/TwittterSearch-Sails--Node-ES-Mongo.git`
2. Install dependencies: `npm install`
4. Add your own MongoDB database configuration to `api/Models/TwitterAPI.js`
5. Start the server: `sails lift`
6. Open homepage by visiting: `http://localhost:1337`

Once everything is set up, we can fetch tweets from Twitter API and store in Elastic Search and Analytics in Mongo DB.

## API Routes

1. To search Tweets by Twitter API

  -http://localhost:1337
  
  
2. Return the number of tweets

  -http://localhost:1337/allTweetsAPICount


3. Displays top ten people who tweeted most

  -http://localhost:1337/tenPeopleTwittedMost


4. Displays most recent tweets

  -'http://localhost:1337/mostRecentTweets
  
  
5. Display least recent tweets

  -http://localhost:1337/leastRecentTweets


6. Sort and display tweets by user who are having more followers

  -http://localhost:1337/sortByFollowers


7. Display all documents present in mongoDB collection

  -http://localhost:1337/showMongoData
