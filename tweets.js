var moment = require('moment');

function Tweets (obj)
{
    this.obj = obj;
    this.list = [];
    this.init = function()
    {
        var self = this;
        console.log(`---My Tweets---\n`);
        self.obj.forEach(function(tweet){
            console.log(tweet.text);
            console.log(`   -${self.getDate(tweet.created_at)}`);
            console.log(`\n`);
        })
    };

    this.getDate = function(d8Str)
    {
        d8Str = d8Str.substring(0,d8Str.lastIndexOf(":") + 3) + " " + d8Str.slice(-4);
        return (moment(d8Str, "ddd MMM DD HH:mm:ss YYYY").format("dddd, MMMM Do YYYY @ hh:mm a"));
    }
}

module.exports = Tweets;