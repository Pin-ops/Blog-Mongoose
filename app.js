//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "This is my Daily Blog! I try to write my days here.";
const aboutContent = "Hello World! I am Pinar. I have been living in Germany for one year. I am an English Teacher but now I'm learning German!";
const contactContent = "You can always contact me per e-mail. E-Mail: pinozmen89@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {

    Post.find({}, function(err, posts) {
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    });
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });


    post.save(function(err) {
        if (!err) {
            res.redirect("/");
        }
    });
});

app.get("/posts/:postId", function(req, res) {

    const requestedPostId = req.params.postId;

    Post.findOne({ _id: requestedPostId }, function(err, post) {
        res.render("post", {
            title: post.title,
            content: post.content
        });
    });

});

app.get("/about", function(req, res) {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
    res.render("contact", { contactContent: contactContent });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});