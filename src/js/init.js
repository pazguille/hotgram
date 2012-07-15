window.onload = function () {
	(function(a){"use strict";var b=function(){var a=document.head||document.getElementsByTagName("head")[0],b=navigator.appName.indexOf("Microsoft")===0,c=0,d,e,f;f=function(a){var c=document.createElement("script");c.src=a;c.async="async";if(b){c.defer="defer"}return c};e=function(a,b,e){if(a!==b[b.length-1]){c+=1;d(b[c],b,e);return}if(e){e()}};d=function(c,d,g){var h=f(c);if(b&&h.readyState){h.onreadystatechange=function(){if(h.readyState==="loaded"||h.readyState==="complete"){h.onreadystatechange=null;e(c,d,g)}}}else{h.onload=function(){e(c,d,g)}}a.appendChild(h)};return{me:function(a,b){if(typeof a==="string"){a=[a]}(function(a,b){d(a[c],a,b)})(a,b);return this}}}();a.give=b})(window);
	give.me(["vendor/jquery.js","vendor/underscore.js","vendor/backbone.js","src/js/app.js"], function () {
		new app.hottest();
	});

	var _gaq=[['_setAccount','UA-15753373-6'],['_trackPageview']];
	(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
	g.src=('https://ssl.google-analytics.com/ga.js');
	s.parentNode.insertBefore(g,s)}(document,'script'));
};