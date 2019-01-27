var express = require("express");
var Article = require("../model/Article");
var Note = require("../model/Note");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
	app.get("/", function(req, res)  {
		Article.find({saved: false}).then(function(articles) {
			if(articles.length == 0){
				axios.get("http://www.nytimes.com")
					.then(function(response){
						var articles = [];
						var $ = cheerio.load(response.data);
						$("div.css-1100km").each(function(i, element) {
							var title = $(this).find("h2").text().trim();
							var url = $(this).find("a").attr("href");
							var summary = $(this).find("p").text().trim();
							if(title && url && summary) {
								var data = {
									title: title,
									url: "https://nytimes.com"+url,
									summary: summary
								};
								articles.push(data);
							}
						});

						Article.create(articles).then(function(data) {
							res.render("index", {articles: data});
						}).catch(function(err) {
							res.render("index");
						});
					}).catch(function(err){
						res.render("index");
					});
			} else {
				res.render("index", {articles: articles});
			}
		});
	});

	app.get("/savedArticles", function(req, res)  {
		Article.find({saved: true}).then(function(articles) {
			if(articles.length != 0){
				res.render("index", {articles: articles});
			} else {
				res.render("index", {message: {"text":"There are no saved articles!!! Please scrape for latest news!!!"}});
			}
		});
	});

	app.get("/api/clear", function(req, res) {
		Article.remove({})
			.then(dbArticle => res.json(dbArticle))
			.catch(err => res.json(err));

		Note.remove({})
			.then(dbArticle => res.json(dbArticle))
			.catch(err => res.json(err));
	});

	app.put("/api/article/:id", function(req, res) {
		Article.findOneAndUpdate({_id:req.params.id}, {$set: req.body}, {new: true})
			.then(dbArticle => res.json(dbArticle))
			.catch(err => res.json(err));
	});

	app.delete("/api/article/:id", function(req, res) {
		Article.remove({_id:req.params.id})
			.then(dbArticle => {
				Note.remove({_articleId: req.params.id})
					.then(notes => {
						res.json("removed success");
					})
			})
			.catch(err => res.json(err));

	});

	app.post("/api/note", function(req, res) {
		Note.create(req.body)
			.then(dbNote => res.json(dbNote))
			.catch(err => res.json(err));
	});

	app.get("/api/note/:id", function(req, res) {
		Note.find({_articleId: req.params.id})
			.then(dbNote => res.json(dbNote))
			.catch(err => res.json(err));
	});

	app.delete("/api/note/:id", function(req, res) {
		Note.remove({_id: req.params.id})
			.then(dbNote => res.json(dbNote))
			.catch(err => res.json(err));
	});
};