// Save token
if (window.location.hash.indexOf("access_token") !== -1) {
	localStorage["hotgramToken"] = window.location.hash.split("=")[1];
	window.location = "/hotgram";
}

if (localStorage["hotgramToken"]){
	$(".login").remove();
	//self.close();
}
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
		this.collection = new PhotoCollection();
		
		this.$el
			.prepend(this.$list);

		this.$el.removeClass("ch-hide");

		this.reset();

		this.fetch();
	},

	"events": {
		"scroll": "more",
		"click .shareButton": "shareButton"
	},

	"$list": $("<ul class=\"ch-slats ch-hide\">"),

	"$loading": $(".ch-loading"),

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

	"more": function () {
		var height = this.$list.height() - this.$el.height();
		var bottom = this.el.scrollTop;
		if (height === bottom) {
			this.fetch();
		};

		return;
	},

	"shareButton": function (event) {
		(function () {
			var link = event.target;
			$.ajax({
				"url": link.href,
				"type": "POST",
				"dataType": "JSON",
				"data": {"access_token": localStorage["hotgramToken"]}
			});
			$(link).toggleClass("ch-icon-heart ch-icon-heart-empty");
		}());
		return false;
	},

	"reset": function () {
		this.collection.reset();
		this.$list.html("");
	}

});

//chrome.tabs.create({"url":"https://instagram.com/oauth/authorize/?client_id=8592b07f6eaf4efb9e3b6c7a054b6aa0&redirect_uri=http://pazguille.github.com/hotgram/&response_type=token&scope=likes"});

var hottest;
setTimeout(function () {
	hottest = new AppView();
}, 1000);