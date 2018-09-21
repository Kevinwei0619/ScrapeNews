const db = require('../models');


module.exports = function(app){


    app.get("/api/detele/:id" , function(req , res){
        


    });

    // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/api/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    var id = req.params.id;
    console.log("id: " , id);

    db.Note.create(req.params.id)
    .then(function (dbNote) {


      return db.Article.findOneAndUpdate({
        _id: id
      }, {
        note: dbNote.id,
        isSaved:true
      }, {
        new: true
      }).populate("note")

    }).then(function (dbArticle) {
      // res.json(dbArticle);
      res.redirect("/");
    }).catch(function (err) {
      res.json({"ertype ": err});
    })


    // db.Article.findOne({
    //     _id: id
    //   }).populate("note")
    //   .then(function (found) {
    //     res.json(found);
       

    //   })
    //   .catch(function (err) {
    //     res.json(err);
    //   })


  });



};