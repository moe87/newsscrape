var express = require('express');
var PORT = process.env.PORT || 3000;
var app = express();
var path = require("path");

app.use(express.static(path.join(__dirname, 'app/public')));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
	defaultLayout: "main",
	layoutsDir: path.join(__dirname, 'app/views/layouts'),
	helpers: {json: function(context) {return JSON.stringify(context);}}
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, 'app/views'));

require("./app/routing/routes")(app);

var mongoose = require('mongoose');
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/articles";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(PORT, function() {console.log("Server Listening on:"+PORT)});
