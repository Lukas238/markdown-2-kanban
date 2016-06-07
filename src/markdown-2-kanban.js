var Loader = function () { }
Loader.prototype = {
	require: function (scripts, callback) {
		this.loadCount      = 0;
		this.totalRequired  = scripts.length;
		this.callback       = callback;

		for (var i = 0; i < scripts.length; i++) {
			this.writeScript(scripts[i]);
		}
	},
	loaded: function (evt) {
		this.loadCount++;

		if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
	},
	writeScript: function (src) {
		var self = this;
		var s = document.createElement('script');
		s.type = "text/javascript";
		s.async = true;
		s.src = src;
		s.addEventListener('load', function (e) { self.loaded(e); }, false);
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(s);
	}
}


var l = new Loader();
l.require([
	"https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.js"
], 
function() {
	// Callback
	init();
});

	
function init(){
	var org_content = $('body').html();
	
	//Badge
	org_content = org_content.replace(/\(([a-zA-Z])\)/, '<span class="badge badge-$1">$1</span>');
	
	var output = $('<div />').html( org_content );
	$(output).find('script').remove();
	
	$(output).html( marked( $(output).html()) );
	
	$(output).find('h2+ul').addClass('collection with-header z-depth-1 hoverable').find('li').addClass('collection-item');
	$(output).find('> h2').each(function(){
		var title = $(this).html();
		var next_ul = $(this).next('ul');
		
		if(next_ul.length){
			$(next_ul).prepend('<li class="collection-header"><h5>' + title + '</h5></li>')
		}else{
			$('<ul class="collection with-header z-depth-1 hoverable"><li class="collection-header"><h5>'+ title +'</h5></li></ul>').insertAfter(this);
		}
		$(this).remove();
	});
	
	$(output).wrapInner('<div class="row"></div>').find('ul').each(function(){
		$(this).wrapAll('<div class="col m3"></div>');
	});
	$(output).find('.row .col:last').attr('class', 'col m12');

	$('body').html( $(output).html() );
		
	$('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.css">').appendTo('head');
	$('<link rel="stylesheet" type="text/css" href="styles.css">').appendTo('head');

	
	
	/*
	$.get(location.href, function(data){
		console.log($.type(org_content));
		console.log($.type(data));
		if( org_content === data  ){
			console.log('equal');
		}else{
			console.log('diff');
		}
	});
	*/
	
}