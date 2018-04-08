require("dotenv").config();

var fs = require("fs"),
    Keys = require('./keys'),
    Movie = require('./movie'),
    Request = require('request'),
    Spotify = require('node-spotify-api'),    
    Twitter = require('twitter');

//console.log(Keys.twitter);

var liri  = {
    actions: [
        {user: "my-tweets", fnID: "tweets" },
        {user: "spotify-this-song", fnID: "spotify" },
        {user: "movie-this", fnID: "OMDB" },
        {user: "do-what-it-says", fnID: "FS" }
    ],
    verifyAction: function() {
        var self = this,
            type = process.argv[2],
            input = (process.argv.length > 3) ? process.argv[3].replace(/[<>]/g,"") : "",
            action = self.actions.find( thisAction => thisAction.user === type);
            return {
                    idObj: action,
                    input: input, 
                    msg: (action != undefined) ? "success" : "Please enter a valid action to proceed"
                   };
    },
    startUp: function() {
        var self = this,
            action = self.verifyAction();

            if (!action.idObj)
            {
                return console.log(action.msg);
            }

            self[action.idObj.fnID](action.input);
    },
    tweets: function(){
        console.log("get tweets");
        var thisTwitter = new Twitter(Keys.twitter);
        var params = {screen_name: 'dmeeks91'};
            thisTwitter.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    console.log(tweets);
                }
            });
    },
    spotify: function(song){
        console.log("spotify song");
        var thisSpotify = new Spotify(Keys.spotify);

        thisSpotify.search({type: 'track', query: song}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }             
            console.log(JSON.stringify(data, null, 2));
        });
    },
    OMDB: function(movie){
        var queryUrl = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`;
        Request(queryUrl, function(error, response, body) {
            if(!error && response.statusCode === 200){
                var thisMovie = new Movie(JSON.parse(body));
                thisMovie.details();
            }
        });
    },
    FS: function(){
        console.log("do what the file says");
    }
    
    
    
}

liri.startUp();

/* var inventory = [
    {name: 'apples', quantity: 2},
    {name: 'bananas', quantity: 0},
    {name: 'cherries', quantity: 5}
];

function isCherries(fruit) { 
    return fruit.name === 'apples';
}

console.log(inventory.find(isCherries) != undefined); */

