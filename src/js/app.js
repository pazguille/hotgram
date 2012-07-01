// Save token
/*if (window.location.hash.indexOf("access_token") !== -1) {
	localStorage["hotgramToken"] = window.location.hash.split("=")[1];
	window.location = "/hotgram";
}

if (localStorage["hotgramToken"]){
	$(".login").remove();
}*/
/*
https://instagram.com/oauth/authorize/?client_id=8592b07f6eaf4efb9e3b6c7a054b6aa0&redirect_uri=http://pazguille.github.com/hotgram/&response_type=token&scope=likes
me devuelve esto:
http://pazguille.github.com/hotgram/#access_token=51439841.e7f1bd8.49b62a6be28748fca64f30067c8fdc36
curl -F 'access_token=51439841.f59def8.8be3f5264a934884b3e5eb0aecd36097' \
https://api.instagram.com/v1/media/{media-id}/likes
*/

/*
* Models
*/

var Photo = Backbone.Model.extend({});

/*
* Collections
*/
var PhotoCollection = Backbone.Collection.extend({
	"model": Photo,

	"sync": function (method, model, options) {
		options.dataType = "jsonp";
		options.data = {"client_id": "8592b07f6eaf4efb9e3b6c7a054b6aa0"};

		return Backbone.sync(method, model, options);
	},

	"parse": function (response) {
		return response.data;
	},

	"popularUrl": function () {
		return (this.url = "https://api.instagram.com/v1/media/popular");
	},

	"searchUrl": function (query) {
		return (this.url = "https://api.instagram.com/v1/tags/" + query + "/media/recent");
	},

	"url": "https://api.instagram.com/v1/media/popular"
});

/*
* Views
*/
var PhotoView = Backbone.View.extend({
	"tagName": "li",

	"template": _.template($("#tpl-photo").html()),

	"render": function () {
		var photo = this.model,
			caption = photo.get("caption"),
			description = "";

		if (caption !== null) {
			description = photo.get("caption").text;
		}

		photo.set("description", description)

		photo = photo.toJSON();

		$(this.el).html(this.template(photo));

		return this;
	}
});

var AppView = Backbone.View.extend({
	"el": "#hottest",

	"initialize": function () {
		var that = this,
			$query = $("#query");

		this.collection = new PhotoCollection();

		this.$search.on("submit", function () {
			that.query = $query.val();
			that.searching();
			return false;
		});
		
		this.$el
			.prepend(this.$list);

		this.$el.removeClass("ch-hide");

		$(window).on("scroll", function () {
			if (window.scrollY + window.innerHeight == document.body.scrollHeight) {
				that.fetch();
			}
		});

		this.reset();

		this.fetch();
	},

	"events": {
		"click .shareButton": "shareButton"
	},

	"$list": $("<ul class=\"ch-slats ch-hide\">"),

	"$loading": $(".ch-loading"),

	"$search": $(".ch-header-form"),

	"query": "",

	"render": function () {
		var that = this;

		_.each(this.collection.models, function (photo) {
			var photo = new PhotoView({"model": photo});
			that.$list.append(photo.render().el);
		}, this);

		this.$list.removeClass("ch-hide");

		that.trigger("end");

		return this;
	},

	"fetch":  function () {
		var that  = this;
		this.$loading.removeClass("ch-hide");
		this.collection.fetch({
			"success": function () {
				that.$loading.addClass("ch-hide");
				that.render();
			}
		});
	},

	"shareButton": function (event) {
		if (localStorage["hotgramToken"]) {
			(function () {
				var link = event.target;
				$.ajax({
					"url": link.href,
					"type": "POST",
					"dataType": "json",
					"data": {
						"access_token": localStorage["hotgramToken"]
					},
					"success": function () {
						$(link).toggleClass("ch-icon-heart ch-icon-heart-empty");
					},
					"error": function () {
						$(link).toggleClass("ch-icon-heart ch-icon-heart-empty");	
					}
				});
			}());
			return false;
		}

		window.location.href = $(".login")[0].href;

		return false;
	},

	"searching": function () {
		if (this.query !== "") {
			this.collection.searchUrl(this.query);
		} else {
			this.collection.popularUrl();
		}
		this.reset();
		this.fetch();
	},

	"reset": function () {
		this.collection.reset();
		this.$list.html("");
	}

});

var hottest;
setTimeout(function () {
	hottest = new AppView();
}, 1000);