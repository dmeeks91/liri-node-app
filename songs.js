function Songs (obj, title)
{
    this.obj = obj;
    this.title = title;
    this.list = [];
    this.init = function()
    {
        for(song in this.obj)
        {   
            if (title === this.obj[song].name)
            {
                this.addSong(this.obj[song]);
            }
        }
    };
    this.addSong = function(details) {
        var thisSong = new Song(details, this.title);
        thisSong.getArtistString();
        this.list.push(thisSong);
        //thisSong.getSongDetails();
    };
    this.showSelected = function(artist){
        var userSong = this.list.find(thisSong => thisSong.Artist == artist);
        userSong.getSongDetails();
    };
}

function Song (details)
{
    this.Artist = '';
    this.Title = details.name;
    this.Album = details.album.name;
    this.Link = details.preview_url;
    this.Details = details;

    this.getArtistString = function() {
        var names = this.Details.artists.map(function(thisArt){
            return thisArt.name;
        });
        this.Artist = names.join(", ");
    }

    this.getSongDetails = function() {
        console.log(`\n----Song Details---\n`);
        for(prop in this)
        {
            if(typeof this[prop] != "function" && prop != "Details")
            {
                var display = (prop != "Artist" || (prop === "Artist" && this[prop].indexOf(", ") === -1)) ? prop : "Artists";
                console.log(`${display}: ${this[prop]}`);
            }
        }
    }
}

module.exports = Songs;