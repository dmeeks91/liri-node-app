require("dotenv").config();

var fs = require("fs"),
    inquirer = require('inquirer',)
    Keys = require('./keys'),
    Movie = require('./movie'),
    Request = require('request'),
    Songs = require('./songs'),
    Spotify = require('node-spotify-api'),
    Tweets = require('./tweets');    
    Twitter = require('twitter');

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
    tweets: function()
    {
        console.log("get tweets");
        var thisTwitter = new Twitter(Keys.twitter);
        var params = {screen_name: 'dmeeks91'};
            thisTwitter.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    var twitterLog = new Tweets(tweets);
                    twitterLog.init();
                    //twitterLog.print();
                }
            });
    },
    spotify: function(song)
    {
        var self = this,
            thisSpotify = new Spotify(Keys.spotify);

        thisSpotify.search({type: 'track', query: song}, function(err, data) 
        {
            if (err) 
            {
                return console.log('Error occurred: ' + err);
            }

            self.displaySong(new Songs(data.tracks.items, song));            
        });
    },
    displaySong: function(allSongs)
    { 
        var self = this;
        allSongs.init();
        switch (allSongs.list.length)
        {
            case 0:
                console.log(`Unable to find any songs titled "${allSongs.title}".`);
                console.log(`Why don't you try listening to the "The Sign"?`);
                self.spotify("The Sign");
                break;
            case 1:
                allSongs.showSelected(allSongs.list[0].Artist);
                break;
            default:
                self.selectArtist(allSongs).then(function(data){
                    allSongs.showSelected(data.thisArtist);
                })
                break;
        }
    },
    selectArtist: function(songs)
    {
        var msg = `We found ${songs.list.length} songs titled "${songs.title}". 
        Please select the artist(s) you had in mind:`,
            aList = songs.list.map(function(thisSong){
                return thisSong.Artist;
            });

        return inquirer.prompt([
            {
                type: "list",
                name: "thisArtist",
                message: msg,
                choices: aList
            }
        ])
    },
    OMDB: function(movie)
    {
        if (movie.length < 1) movie = "Mr. Nobody";
        
        //encodeURIComponent allows us to find movie titles with special characters ie. Love & Basketball
        var queryUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movie)}&y=&plot=short&apikey=trilogy`;
        Request(queryUrl, function(error, response, body) {
            result = JSON.parse(body);
            if(!error && result.Response != "False"){
                var thisMovie = new Movie(JSON.parse(body));
                thisMovie.details();
            }
            else
            {
                console.log(`Unable to find ${movie} with the OMDB API`);
            }
        });
    },
    FS: function(){
        console.log("do what the file says");
    }
    
    
    
}

liri.startUp();

