
/* Configure the Twitter API */
var TWITTER_CONSUMER_KEY = 'xxxxxxxxxxxxxxxx';
var TWITTER_CONSUMER_SECRET = 'xxxxxxxxxxxxxxxx';
var TWITTER_ACCESS_TOKEN = 'xxxxxxxxxxxxxxxx';
var TWITTER_ACCESS_TOKEN_SECRET = 'xxxxxxxxxxxxxxxx';

var Twit = require('twit');
var axios = require('axios');
var unirest = require('unirest');

var Bot = new Twit({
	consumer_key: TWITTER_CONSUMER_KEY,
	consumer_secret: TWITTER_CONSUMER_SECRET,
	access_token: TWITTER_ACCESS_TOKEN,
	access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

console.log('The bot is running...');

/* BotInit() : To initiate the bot */
function BotInit() {
	console.log('Bot initiated');
	Tweet();
	favoriteTweet();
}

/* BotTweet() : To retweet the matching recent tweet */
function BotTweet() {

	unirest.get("https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies&count=1")
		.header("X-Mashape-Key", "UbSVbpHdq4mshb5iK5E3qsCfYrW5p1VYTgbjsnl17XRvrDG390")
		.header("Content-Type", "application/x-www-form-urlencoded")
		.header("Accept", "application/json")
		.end(function (result) {
			Bot.post('statuses/update', { status: result.body.quote +' #movies #quotes' + "\n\n[" + result.body.author + ']'}, function(err, data, response) {
				console.log('Tweeted a fucking quote!');
			})
		});

		favoriteTweet();
}

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
	var items = ['#quotes', '#motivation', '#inspiration'];
	var params = {
		q: items[Math.floor(Math.random()*items.length)],  // REQUIRED
		result_type: 'recent',
		lang: 'en',
		// count: 10
	}
	// for more parametes, see: https://dev.twitter.com/rest/reference

	// find the tweet
	Bot.get('search/tweets', params, function(err,data){

		// find tweets
		// console.log(data);

		var tweet = data.statuses;
		var randomTweet = undefined;
		tweet ? (randomTweet = ranDom(tweet)) : console.log('Not running fav function.');   // pick a random tweet

	  // if random tweet exists
	  if(typeof randomTweet != 'undefined'){
		// Tell TWITTER to 'favorite'
		Bot.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
		  // if there was an error while 'favorite'
		  if(err){
			console.log('CANNOT BE FAVORITE... Error');
		  }
		  else{
			console.log('FAVORITED... Success!!!');
		  }
		});
	  }
	});
  }
  // grab & 'favorite' as soon as program is running...
  favoriteTweet();
  // 'favorite' a tweet in every 60 minutes
  // setInterval(favoriteTweet, 30*60*1000);

  // function to generate a random tweet tweet
  function ranDom (arr) {
	var index = Math.floor(Math.random()*arr.length);
	return arr[index];
  };

/* Set an interval of 30 minutes (in microsecondes) */
setInterval(BotTweet, 30*60*1000);

/* Initiate the Bot */
BotInit();