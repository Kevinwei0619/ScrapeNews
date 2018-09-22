getArticles();


function getArticles() {
    // Grab the articles as a json
    $.get("/", function (data) {
    });
};


$(document).ready(function () {
    $("#scrapeNews").on('click', function () {
        console.log("scrapeNews");
        getArticles();
    });
    $("#clearArt").on('click', function () {
        console.log("clearArt");
    })
});

$(document).on("click" , ".saved" , function(){
    var idFromSaved = $(this).attr("data-id");
    $(".art"+idFromSaved).addClass("hide");
    console.log("idFromSaved: " , idFromSaved);

    $.ajax({
        method:"GET",
        url:"/articies/saved/" + idFromSaved
    }).then(function(data){
        console.log(data);
        // window.location.replace("/");
       
    })
});


$(document).on("click" , ".deteleSaved" , function(){
    var idFromdeteleSaved = $(this).attr("data-id");
    $(".art"+idFromdeteleSaved).addClass("hide");
    console.log("idFromdeteleSaved: " ,idFromdeteleSaved);
    $.ajax({
        method:"GET",
        url:"/deleteFromSavedList/" + idFromdeteleSaved
    }).then(function(data){
        console.log(data);
        // window.location.replace("/saved");
    })
});

$(document).on("click" ,".card-body" , function(){
    var idFromCard = $(this).attr("data-id");


})


$(document).on("click" , "#saveMyNote" , function(){
    
    var noteData = $("#Note-text").val().trim();
    var idFromNote = $(this).attr("data-id");
   

    // console.log("data: " , data);
    // console.log("idFromNote: " , idFromNote);
$.ajax({
    method:"POST",
    data: {
        body:noteData
    },
    url:"/articles/"+ idFromNote
}).then(function(result){
    console.log(result);
    $("#Note-text").val("");

})


})



$(document).on("click" , ".deleteBtn" , function(){
    var idFromDeleteNote = $(this).attr("data-id");
    var idForArticles = $("#saveMyNote").attr("data-id");
    $(".noteX"+idFromDeleteNote).addClass("hide");
    console.log(idForArticles);
    console.log(idFromDeleteNote);
$.ajax({
    method:"DELETE",
    url:"/notes/delete",
    data:{
        idForArt: idForArticles,
        idForNote: idFromDeleteNote
    }
}).then(function(result){

console.log(result);


});




})





$(document).on("click", ".articleNote", function() {

    var idFromarticleNote = $(this).attr("data-id");
    console.log("idFromarticleNote: " , idFromarticleNote);
    console.log("articleNote");
    $("#articleNotes").empty();

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + idFromarticleNote
    })
      // With that done, add the note information to the page
      .then(function(data) {
       
        $("#saveMyNote").attr("data-id", idFromarticleNote);
        // var content = $(".card-header").children("a").text().trim();
        $("#exampleModalLabel").empty();
        $("#exampleModalLabel").prepend("<h5 id='modalTitle'> Add Not for News : " + data.title + "</h5>");
        console.log(data.note);

        if (!data.note.length == 0) {
            for(var i = 0; i<data.note.length; i++){
                $("#articleNotes").append("<p class='border border-dark noteX"+ data.note[i]._id +"'>"+data.note[i].body+"<button data-id='"+data.note[i]._id+"'type='button' class='btn btn-danger deleteBtn'>X</button></p>");
            }
        }
        
      });
  });

  // When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  