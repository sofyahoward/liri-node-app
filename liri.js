//dotenv
require('dotenv').config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('file-system');
var command = process.argv[2]; // command
var query = process.argv[3]; // search query  plus loop to capture the others can use condtionals or switch function
var keys = require("./keys.js");
var client = new Twitter(keys.twitter);

// Function for Twitter function
var myTweets = function() {

// Twitter API parameters
var params = {screen_name: 'messymountains',
              count: 20
};
// GET request for last 20 tweets
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for (var i = 0; i<tweets.length; i++) {
      console.log(tweets[i].text);
  }
  } else {
    console.log(error);
  }
});
}

// Function for Spotify function
function spotifyThisSong() {
	if(query){
		//spotify request
		var spotify = new Spotify(keys.spotify);
	
		spotify.search({ type: 'track', query: query }, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			if(!data){
				console.log("Invalid input");
				return;
			}
			console.log("Artist:       " + data.tracks.items[0].album.artists[0].name); 
			console.log("Song:         " + data.tracks.items[0].name); 
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album:        " + data.tracks.items[0].album.name);
	
		});

	} else {
		console.log("Artist: Ace of Base"); 
		console.log("Song name: The Sign"); 
		console.log("Listen at: https://play.spotify.com/track/3DYVWvPh3kGwPasp7yjahc?play=true&utm_source=open.spotify.com&utm_medium=open"); 
		console.log("Album: The Sign"); 
	};
};

// Functions for OMDB
function movieThis() {
//OMDB
if(!query){
	query = "Mr+Nobody"
} else {
				var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=40e9cece";
					request(queryUrl, function(error, response, body){
						if(error){
							console.log('error:', error); // Print the error if one occurred
						}else{
							console.log('body:', body); // Print the HTML for the Google homepage.
							console.log("Title: " + JSON.parse(body).Title);
							console.log("Year: " + JSON.parse(body).Year);
							console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
							console.log("Rotten Tomatoes Rating: " + JSON.parse(body).rottenTomatoesRating);
							console.log("Production Country: " + JSON.parse(body).Country);
							console.log("Plot: " + JSON.parse(body).Plot);
							console.log("Actors: " + JSON.parse(body).Actors);
						}  
					})
				};
};

// App functionality due to user input
if(command === "my-tweets") {
	myTweets();
} else if(command === "spotify-this-song") {
	spotifyThisSong(query);
} else if(command === "movie-this") {
	movieThis(query);
} else if(command === "do-what-it-says") {
	// App functionality from file read / loads fs npm package
	var fs = require("fs");

	fs.readFile("random.txt", "utf-8", function(error, data) {
		var command;
		var query;

		// If there is a comma, then we will split the string from file in order to differentiate between the command and query
		// 	--> if there is no comma, then only the command is considered (my-tweets)
		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		// After reading the command from the file, decides which app function to run
		if(command === "my-tweets") {
			myTweets();
		} else if(command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if(command === "movie-this") {
			movieThis(query);
		} else { // Where the command is not recognized
			console.log("Command from file is not a valid command! Please try again.")
		}
	});
} else if(command === undefined) { // Where no command is given
	console.log("Please enter a command to run LIRI. You can choose from my-tweets, spotify-this-song, and movie-this")
} else { // use case where command is given but not recognized
  console.log("Hmm, I don't recognize that command. Can you please try again?")
}