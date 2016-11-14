var elasticsearch = require('elasticsearch');
var Twitter = require('twitter');
module.exports = {
    client : new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  }),
  twitterClient: new Twitter({
  consumer_key: 'V1AD6VjDwdDTTmP2Ff3Qyjq1d',
  consumer_secret: 'Yl79jCDIkuOoy3xRjWf6Kt2szilGi8wccbMOsdyI2QyN8XVjLd',
  access_token_key: '2377279086-8r94310cqI397NYpUFLWglrVh8SLp0bgoVoU2Go',
  access_token_secret: 'iuD60sc1syw8YRahvLYTHJ5mutbgx7Ir55TlEBR3f9oU6'
})
};