# TwitterSearch-Sails--Node-ES-Mongo


This is a Node JS app to demonstrate fetching of tweets from Twitter API and storing it in Elastic Search using sails.js.

## Requirements

- node, npm, ElasticSearch, MongoDB

## Usage

1. Clone the repo: `git clone git@github.com:GargPrince/TwittterSearch-Sails--Node-ES-Mongo.git`
2. Install dependencies: `npm install`
4. Add your own MongoDB database configuration to `api/Models/TwitterAPI.js`
5. Start the server: `sails lift`
6. Open homepage by visiting: `http://localhost:1337`

Once everything is set up, we can fetch tweets from Twitter API storing them in Elastic Search and Analytics in Mongo DB.

## API endpoints

1. To search Tweets using Twitter API

  -http://localhost:1337
  
  
2. Returns number of tweets

  -http://localhost:1337/allTweetsAPICount


3. Displays top ten people or twitter handles who tweeted the most

  -http://localhost:1337/tenPeopleTwittedMost


4. Displays most recent tweets

  -'http://localhost:1337/mostRecentTweets
  
  
5. Display least recent tweets

  -http://localhost:1337/leastRecentTweets


6. Display user tweets sorted by number of followers

  -http://localhost:1337/sortByFollowers


7. Display all documents present in mongoDB collection

  -http://localhost:1337/showMongoData
