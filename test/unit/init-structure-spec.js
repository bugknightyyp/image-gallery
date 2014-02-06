module("verify correct structure of image-gallery");

test("consistent of right, left-right", function(){
  var len = 15;
  
  var otions = {
    thumbnailMenuPosition: "right",
    slideWay: "left-right",
    thumbnailWidth: 100,
    thumbnailHeight: 50,
    thumbnailsSpace: 10,
    numsPerScreen: 4
  }
  
  var modeParams_1 = getModelParams(len, otions);
  // have div.normal-window
  var gallery_1 = initStructure(len, true, modeParams_1, otions);
    
  ok(gallery_1[0].nodeName == "DIV", "the gallery should be a div");
  
  ok(gallery_1.is(".image-gallery"), 'there is a div.normal-window in gallery');
  ok(gallery_1.find(".normal-window").length === 1, "the gallery should have a div classname is normal-window");
  ok(gallery_1.find(".normal-window > ul > li").length === len, '$("div.normal-window ul li").length show equal source length');
  
  ok(gallery_1.find(".thumbnail-menu").length === 1, "the gallery should have a div named thumbnail-menu");
  ok(gallery_1.find(".thumbnail-menu .thumbnail-window").length === 1, "the gallery should have a div classname is thumbnail-window");
  ok(gallery_1.find(".thumbnail-menu .thumbnail-window .thumbnail-wrap").length === len, 
    '$("div.thumbnail-menu .thumbnail-window .thumbnail-wrap").length  show equal source length');
    
  ok(gallery_1.find(".normal-window").next().is(".thumbnail-menu"), 'div.noarmla-window before div.thumbnail-menu' );
  
 // not have div.normal-window
  var gallery_2 = initStructure(len, false, modeParams_1, otions);
   ok(gallery_2.find(".normal-window").length === 0, "there is not div.normal-window in gallery");
   
});

var Money = function(options) {
	this.amount = options.amount || 0;
	this.template = options.template || "{symbol}{amount}";
	this.symbol = options.symbol || "$";
};
Money.prototype = {
	add: function(toAdd) {
		this.amount += toAdd;
	},
	toString: function() {
		return this.template
			.replace("{symbol}", this.symbol)
			.replace("{amount}", this.amount)
	}
};
Money.euro = function(amount) {
	return new Money({
		amount: amount,
		template: "{amount} {symbol}",
		symbol: "EUR"
	});
};

module("Money", {
	setup: function() {
		this.dollar = new Money({
			amount: 15.5
		});
		this.euro = Money.euro(14.5);
	},
	teardown: function() {
		// could use this.dollar and this.euro for cleanup
	}
});

test("add", function() {
	equal( this.dollar.amount, 15.5 );
	this.dollar.add(16.1)
	equal( this.dollar.amount, 31.6 );
});
test("toString", function() {
	equal( this.dollar.toString(), "$15.5" );
	equal( this.euro.toString(), "14.5 EUR" );
});