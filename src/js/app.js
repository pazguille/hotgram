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
		options.data = {"client_id": "e7f1bd84f9c34c02a3bc88cd058942a1"};

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
		var photo = this.model.toJSON();

		$(this.el).html(this.template(photo));

		return this;
	}
});

var AppView = Backbone.View.extend({
	"el": "#hottest",

	"initialize": function () {
		this.page = 1;
		this.limit = 50;
		this.collection = new PhotoCollection();
		
		this.$el
			.prepend(this.$list);

		this.$el.removeClass("ch-hide");

		this.reset();

		this.fetch();
	},

	"events": {
		"scroll": "more",
		"click .repin": "repin"
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
			"data": {
				"limit": this.limit,
				"page": that.page
			},
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
			this.page += 1;
			this.fetch();
		};

		return;
	},

	"repin": function (event) {		
		chrome.tabs.create({url: event.target.href});
		window.close();

		return false;
	},

	"reset": function () {
		this.page = 1;
		this.collection.reset();
		this.$list.html("");
	}

});

var hottest;
setTimeout(function () {
	hottest = new AppView();
}, 1000);