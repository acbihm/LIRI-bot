require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const moment = require("moment");
const fs = require("fs");
const request = require("request");
// const cTable = require('console.table');
const axios = require("axios");

var command = process.argv[2]
var term = process.argv.slice(3).join(" ");

if (command === "concert-this") {
  console.log('');
  console.log("     Searching for upcoming concerts...");
  console.log('');
  concertThis(term);
}
else if (command === "spotify-this-song") {
  console.log('');
  console.log("     Searching Spotify for this song...");
  console.log('');
  spotifyThis(term)
}
else if (command === "movie-this") {
  console.log('');
  console.log("     Searching OMDB for this movie...");
  console.log('');
  movieThis(term);
}
else if (command === "do-what-it-says") {
  console.log('');
  console.log("     One moment...");
  console.log('');
  doThing();
}
else {
  console.log("Error");
}

function spotifyThis(term) {
  if (term == undefined) {
    songName = "The Sign Ace of Base"
  }
  else { var songName = term; }
  spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var searchRes = data.tracks.items;
    console.log('====================================================');
    console.log('');
    console.log(`Here are the top 3 results for '${songName}'`);
    for (var i = 0; i < 3; i++) {
      var result = {
        artist: searchRes[i].album.artists[0].name,
        album_name: searchRes[i].album.name,
        song_name: searchRes[i].name,
        preview_url: searchRes[i].preview_url
      }
      console.log('');
      console.log(`Artist: ${result.artist}`)
      console.log(`   Album: ${result.album_name}`)
      console.log(`      Song title: ${result.song_name}`)
      console.log(`          Listen here: ${result.preview_url}`)
      console.log('');
    }
  });
}

function concertThis(term) {


  axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp").then(
    function (response) {
      var result = response.data;
      var time = result[0].datetime;
      time = moment(time).format("MMM Do YYYY"); 
      var fromNow = moment(result[0].datetime).endOf('day').fromNow(); 
      console.log('');
      console.log('====================================================');
      console.log('');
      console.log(`Here is ${term}'s next live show:`);
      console.log('');
      console.log(`     ${result[0].venue.name} in ${result[0].venue.city}, ${result[0].venue.region}`)
      console.log('');
      console.log(`         Show starts at ${time}.`);
      console.log(`         Starts ${fromNow}.`);
      console.log(''); 
    }
  );
}

function movieThis(term) {
  if (term == undefined) {
    movieName = "Mr. Nobody"
  }
  else { var movieName = term; }
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  axios.get(queryUrl).then(
    function (response) {
      var result = response.data;
      console.log('');
      console.log('====================================================');
      console.log('');
      console.log(`Here is what I found about '${result.Title}: '`);
      console.log('');
      console.log(`   Title: ${result.Title}`);
      console.log(`   Released: ${result.Year}`);
      console.log(`   Starring: ${result.Actors}`);
      console.log(`   Plot:`);
      console.log(`         ${result.Plot} `)
      console.log('');
      console.log(`   Ratings: `);
      console.log(`         ${result.Ratings[0].Value} on ${result.Ratings[0].Source}`);
      console.log(`         ${result.Ratings[1].Value} on ${result.Ratings[1].Source}`);
      console.log('');
      console.log(`   Produced in: ${result.Country}`)
      console.log(`   Audio: ${result.Language}`);
      console.log('');
    }
  );
}

function doThing(randomThing) {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    spotifyThis(data)
  });
}