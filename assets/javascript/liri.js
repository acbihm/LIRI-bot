require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require("fs");
var request = require("request");
var cTable = require('console.table');
var axios = require("axios");



var command = process.argv[2]
var term = process.argv.slice(3).join(" ");
if (command === "concert-this") {
  console.log("Searching for concerts");
  concertThis(term);
}
else if (command === "spotify-this-song") {
  console.log("Searching Spotify for this song");
  spotifyThis(term)
}
else if (command === "movie-this") {
  console.log("Searching OMDB for this movie");
  movieThis(term);
}
else if (command === "do-what-it-says") {
  console.log("One moment...");
  doThing(term);
}
else {
  console.log("Error");
}

function spotifyThis(term) {
  spotify.search({ type: 'track', query: term }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var searchRes = data.tracks.items;
    console.log('=====================');
    console.log('');
    console.log('Here are your top 3 results for ' + "'"+ term +"'");
    for (var i = 0; i < 3; i++) {
      var result = {
        artist: searchRes[i].album.artists[0].name,
        album_name: searchRes[i].album.name,
        song_name: searchRes[i].name,
        preview_url: searchRes[i].preview_url
        
      }
      console.table(result)
    }
  });
}

function concertThis(term) {

  axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp").then(
    function(response) {
      var result = response.data;
      console.log('');
      console.log('=====================');
      console.log('');
      console.log("Here is "  + term + "\'s next live show: " );
      console.log('');
      console.log(result[0].datetime);
      console.log(result[0].venue.name)
      console.log(result[0].venue.city + ", " + result[0].venue.region);
      console.log('');
      console.log('');
    }
  );
}


function movieThis(term) {
  var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy";


  axios.get(queryUrl).then(
    function(response) {
      var result = response.data;
      console.log('');
      console.log('=====================');
      console.log('');
      console.log("Here is what I found about "  + "'"+term +"'" );
      console.log('');
      console.log(result);

      console.log('');
      console.log('');
    }
  );
}
