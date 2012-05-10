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
		//chrome.windows.create({"url": event.target.href, "width": 400, "height":300, "focused": true, "type": "popup"}, function () {});
		(function () {
			var link = event.target;
			$.ajax({
				"url": link.href,
				"type": "POST",
				"data": {"access_token": token},
				"success": function () {
					link.text("Like!");
				}
			});
		}());
		return false;
	},

	"reset": function () {
		this.collection.reset();
		this.$list.html("");
	}

});

var hottest,
	token = "51439841.f59def8.8be3f5264a934884b3e5eb0aecd36097";
setTimeout(function () {
	hottest = new AppView();

}, 1000);