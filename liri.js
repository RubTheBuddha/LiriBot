var keys = require("./keys.js");
var fs = require("fs");
var spotify = require("node-spotify-api");
var request = require("request");
var twitter = require("twitter");


var spotifyAPI = new spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});

var appRequest = process.argv[2];
var nodeArgs = process.argv;

var Request = "";

for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    Request = Request + "+" + nodeArgs[i];
  } else {
    Request = nodeArgs[i];
  }
}

whichApp(appRequest);

function runApp(appRequest) {
  switch (appRequest) {
    case "spotify-info":
      spotifySong(Request);
      break;

    case "my-tweets":
      myTweets(Request);
      break;

    case "movie-info":
      movieThis(Request);
      break;

    case "my-input":
      inputHere();
      break;

    default:
      console.log("Please enter valid app.");
      break;
  }
}

function spotifySong(Request) {
  spotifyAPI.search({ type: 'track', query: Request }, function(err, data) {

    if (err) {
      console.log("Sorry! We couldn't find that tune! ");
      
        } else if (data) {
          var requestSong = data.tracks.items[0];
          songDisplay(requestSong);
        }
      });
   };

function myTweets(Request) {
  var client = new twitter(keys.twitterKeys);
  var rules = { screen_name: Request };
  client.get('statuses/user_timeline', rules, function(error, tweets, response) {
    if (!error) {
  
      for (i = 0; i < tweets.length; i++) {
        console.log("Tweet number: " + (i + 1) + " - Text content: " + tweets[i].text);
        console.log("Created at: " + tweets[i].created_at);
      }
    } else {
      console.log("Twitter user not found.");
    }
  });
}

function movieThis(Request) {
  var movieUrl = "http://www.omdbapi.com/?t=" + Request + "&y=&plot=short&apikey=" + keys.omdbKey;
  request(movieUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var requestMovie = JSON.parse(body);

     
      if (requestMovie.Response === "False") {
        console.log("Movie requested not found.");
       }
     
      else {
        movieDisplay(requestMovie);
      }
    }
  });
};


function movieDisplay(requestMovie) {
  console.log("Title: " + requestMovie.Title);
  console.log("Year: " + requestMovie.Year);
  console.log("IMDB Rating: " + requestMovie.imdbRating);


  var rotten = requestMovie.Ratings.length;
  var rottenExists = false;
  for (i = 0; i < rotten; i++) {
    if (requestMovie.Ratings[i].Source === "Rotten Tomatoes") {
      console.log("Rotten Tomatoes Rating: " + requestMovie.Ratings[i].Value);
      rottenExists = true;
    }
  }
  if (rottenExists === false) {
    console.log("No Rotten Tomatoes Rating available.");
  }
  console.log("Produced in: " + requestMovie.Country);
  console.log("Language: " + requestMovie.Language);
  console.log("Plot: " + requestMovie.Plot);
  console.log("Actors: " + requestMovie.Actors);
}


function inputHere() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    var output = data.split(",");
    var appRequest = output[0];
    Request = String(output[1]).replace(/"/g, "");
    whichApp(appRequest);
  });
}