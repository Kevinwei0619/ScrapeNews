const db = require('../models');


module.exports = function(app){

//delete From Saved List
    app.get("/deleteFromSavedList/:id" , function(req , res){
        var id = req.params.id;
        console.log("deleteFromSavedList: " , id);

    db.Article.findOneAndUpdate({
        _id: id
      }, {
        isSaved:false
      }
    ).then(function (dbArticle) {
      res.json(dbArticle);
      // res.redirect("/");
    }).catch(function (err) {
      res.json({"ertype ": err});
    })
    });
};