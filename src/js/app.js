(function (exports) {
	"use strict";
	var app = (function () {

		/*
		* Models
		*/
		var Photo = Backbone.Model.extend({}),

			/*
			* Collections
			*/
			PhotoCollection = Backbone.Collection.extend({
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
			}),

			/*
			* Views
			*/
			PhotoView = Backbone.View.extend({
				"tagName": "li",

				"template": _.template($("#tpl-photo").html()),

				"render": function () {
					var photo = this.model,
						caption = photo.get("caption"),
						description = "";

					if (caption !== null) {
						description = photo.get("caption").text;
					}

					photo.set("description", description);

					photo = photo.toJSON();

					$(this.el).html(this.template(photo));

					return this;
				}
			}),

			AppView = Backbone.View.extend({
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

					this.reset();

					this.fetch();
				},

				"events": {
					"scroll": "more",
					"click .pic": "pic"
				},

				"$list": $("<ul class=\"ch-slats ch-hide\">"),

				"$loading": $(".ch-loading"),

				"$search": $(".ch-header-form"),

				"query": "",

				"render": function () {
					var that = this;

					_.each(this.collection.models, function (photo) {
						var pic = new PhotoView({"model": photo});
						that.$list.append(pic.render().el);
					}, this);

					this.$list.removeClass("ch-hide");

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
					var height = this.$list.height() - this.$el.height(),
						bottom = this.el.scrollTop;
					if (height === bottom) {
						this.fetch();
					}

					return;
				},

				"pic": function (event) {
					chrome.tabs.create({"url": event.currentTarget.href});
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

			}),

			core = {
				"hottest": AppView
			};

		return core;

	}());

	exports.app = new app.hottest();

}(this));