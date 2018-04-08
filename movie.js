function Movie (obj)
{
  this.obj = obj;
  this.Title = obj.Title;
  this.Year = obj.Year;
  this.IMDB = 0;
  this.Rotten = 0;
  this.Country = obj.Country;
  this.Language = obj.Language;
  this.Plot = obj.Plot;
  this.Actors = obj.Actors;

  this.getRate = function(type) {
    return this.obj.Ratings.find( r8 => r8.Source === type);
  };

  this.details = function() {
    this.IMDB = this.getRate("Internet Movie Database").Value;
    this.Rotten = this.getRate("Rotten Tomatoes").Value;

    console.log(`\n----Movie Details---\n`);
    for(prop in this)
    {
        var title = (prop === "IMDB") ? "IMDB Rating" : 
                    (prop === "Rotten") ? "Rotten Tomatoes Rating" : 
                    prop;

        if(typeof this[prop] != "function" && prop != "obj")
        {
            console.log(`${title}: ${this[prop]}`);                
        };
    }
  }
}

module.exports = Movie;