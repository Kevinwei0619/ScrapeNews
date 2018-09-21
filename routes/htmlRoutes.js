const db = require('../models');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");


module.exports = function (app) {

  app.get("/deleteAll", function (req, res) {
    db.Note.deleteMany({}).then(function (dbNote) {
        return db.Article.deleteMany({});
      }).then(function (dbArticle) {
        // res.json(dbArticle);
        // res.redirect("/")
        // res.render("noArt");
        var del ={
          title:'Uh Oh. Looks like we dont have any new articles'
        };
        res.render("index" , del)
      })
      .catch(function (err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });



  app.get("/saved", function (req, res) {
      // TODO: Finish the route so it grabs all of the articles
      db.Article.find({"isSaved":true}).then(function (dbArticle) {
        // res.json(dbArticle);
        // console.log("dbArticleeeee: ", dbArticle);
        var dataObject = {
          title: 'Scrap Articies fron New York Times',
          ArticleInfo: dbArticle
        };
        // console.log("dataObject: ",dataObject);
        res.render("index", dataObject);
      })

  });

  // app.get("/", function (req, res) {
  //   res.render("index", {
  //     title: 'Scraping With Mongoose'
  //   });
  // });


  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.nytimes.com/section/world").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
   
        $("div.story-meta").each(function(i, element) {
        // Save an empty result object
        // console.log("element: ", element);
        var result = {};

        result.link = $(this).parent("a").attr("href");
        result.title = $(element).children("h2.headline").text().trim();
        result.summary = $(element).children("p.summary").text();

        db.Article.find({
          "title" : result.title,
          "link":result.link,
          "summary":result.summary
        }).then(function(data){
          console.log(data);
          if(!result.length){

            db.Article.create(result)
            .then(function (dbArticle) {
              // View the added result in the console
              // console.log(dbArticle);
            })
            .catch(function (err) {
              // If an error occurred, send it to the client
              return res.json(err);
            });



          }
        })


        // Create a new Article using the `result` object built from scraping
       
      });

      // If we were able to successfully scrape and save an Article, send a message to the client
      // res.send("Scrape Complete");
      res.redirect("/");
    });
  });


  // Route for getting all Articles from the db
  app.get("/", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({"isSaved":false}).then(function (dbArticle) {
      // res.json(dbArticle);
      // console.log("dbArticleeeee: ", dbArticle);
      var dataObject = {
        title: 'Scrap Articies fron New York Times',
        ArticleInfo: dbArticle
      };
      // console.log("dataObject: ",dataObject);
      res.render("index", dataObject);
    })
  });

  // Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  var id = req.params.id;
  db.Article.findOne({
    _id:id
  }).populate("note")
  .then(function(found){
    res.json(found);

  })
  .catch(function(err){
    res.json(err);
  })
  

});





  


  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    var id_2 = req.params.id;

    db.Note.create(req.body)
      .then(function (dbNote) {


        return db.Article.findOneAndUpdate({
          _id: id_2
        }, {
          note: dbNote.id
        }, {
          new: true
        });

      }).then(function (dbArticle) {
        res.json(dbArticle);
      }).catch(function (err) {
        res.json(err);
      })


  });





  app.get("*", function (req, res) {
    res.render("404");
  });

};