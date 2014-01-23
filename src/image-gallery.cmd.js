define(function(require,exprots,module){
var $ = require("jquery");


var imageGallery = function(options) {
  var options = $.extend({
    wraperID: "",
    source: [], //{thumbnail: "", normal: "", preview: "", describe: ""}
    slideWay: 1, //the way of toggle screen。1: left-right; 2: up-down
    thumbnailWidth: 80, 
    thumbnailHeight: 50,
    thumbnailsSpace: 10,
    numsPerScreen: 4, // the numbers of thumbnail per screen
    thumbnailMenuPosition: "down",// preview menu positon relative to the gallery window , the value can is one of left, right, top ,down;
    isAutoSwitchAble: true, // Whether or not the thumbnail automatic switching
    isShowPauseBtn: false,
    isShowThumbnailIndex: false,
    switchScreenSpeed: 100,
    switchThumbnailTime: 3000,
    magnifierWidth: 200,
    magnifierHeight: 200,
    scale: 2
  }, options || {}),
  
    galleryWraper = $(options.wraperID),
    gallery = $("<div class=\"image-gallery\" />"),
    
    normalWindow = null,
    normalElements = null,
    isContainNormalWindow = false,
    
    thumbnailMenu = $("<div class=\"thumbnail-menu\" />"),
    thumbnailBtnFirst = $('<div class="thumbnail-btn thumbnail-btn-first">first</div>'),
    thumbnailBtnSecond = $('<div class="thumbnail-btn thumbnail-btn-second">second</div>'),
    thumbnailWindow = $("<div class=\"thumbnail-window\" />"),
    thumbnailAdjust = $("<div class=\"thumbnail-adjust\" />"),
    thumbnailProxy = $("<ul />"),
    thumbnailElements = null,
    
    
    len = options.source.length,
    thumbnailScreenNum = Math.ceil(len / options.numsPerScreen),
    thumbnailIndex = 0,
    screenIndex = 0,
    isAllThumbnailLoaded = false,
    
    
    previewWindow = null,
    isContainPreviewWindow = false,
    
    magnifier = null,
    
    describeWindow = null,
    isContainDescribeWindow = false,
    
    timer = null,
    
    modelPramas = getmodelPramas();
  
  
  isContainNormalWindow = typeof options.source[0].normal === 'undefined'? false : true;
  isContainNormalWindow &&  (function(){normalWindow = $('<div class="normal-window"><ul></ul></div>')})();
  
  isContainPreviewWindow = typeof options.source[0].preview === 'undefined'? false : true;
  //isContainPreviewWindow &&  (previewWindow = $("<div class=\"preview-window\" />"));
  
  isContainDescribeWindow = typeof options.source[0].describe === 'undefined'? false : true;
  isContainDescribeWindow &&  (function(){describeWindow = $('<div class="describe-window" />')})();
  /**
  * 
  *
  */
	function fetchImg(src, options) {
     var options = $.extend({
        initCallback: $.noop,
        loadCallback: $.noop,
        errorCallback: $.noop
      }, options || {});
			var img;
      img = new Image();
      img.src = src;
      options.initCallback.call(null);
      if (img.complete ) {
        options.loadCallback.call(img);
      } else {
        $(img)
          .load( function(){
            options.loadCallback.call(this);
          })
          .error(function(){
            options.errorCallback.call(null);
          });
      }
  };
  function init() {
    var thumbnails = [];
    for (var i = 0; i< len; i++) {
      isContainNormalWindow && normalWindow.children("ul").append("<li />");
      makeThumbnailMenu(i, thumbnails, modelPramas.isGrounp);
      
    }
    // alert(thumbnails.join(""));
    thumbnailProxy
      .append(thumbnails.join(''))
      .css(modelPramas.thumbnailProxyDimension)
      .children().css({float: "left"}).children()
        .css({"width": options.thumbnailWidth,
              "height": options.thumbnailHeight, 
              "margin-right": options.thumbnailsSpace, 
              "overflow": "hidden", 
              "float": "left"
             });
    thumbnailAdjust.css(modelPramas.thumbnailAdjustDimension);
    thumbnailAdjust.append(thumbnailProxy);   
    thumbnailWindow.append(thumbnailAdjust).css(modelPramas.thumbnailWindowDimension);
    thumbnailMenu.append(thumbnailBtnFirst);
    thumbnailMenu.append(thumbnailBtnSecond);
    thumbnailMenu.append(thumbnailWindow);
    
    thumbnailElements = thumbnailProxy.find("li > div");
    
    normalElements = normalWindow.find("ul li");
    switch (options.thumbnailMenuPosition) {
      case "top":
      case "left":
        gallery.append(thumbnailMenu);
        gallery.append(isContainNormalWindow && normalWindow);
        break;
      case "down":
      case "right":
        gallery.append(isContainNormalWindow && normalWindow);
        gallery.append(thumbnailMenu);
        break;
    }
    galleryWraper.html(gallery);
    
    freshDisplayState();
    bindEvent(modelPramas);
    preloadThumbnailImage();
    
    if (options.isAutoSwitchAble) {
      timer = setInterval(autoSwitch, options.switchThumbnailTime);
    }
    
    preloadNormalImage();
    
    
  };
  function getmodelPramas(){
    var modelPramas = {};
    var thumbnailWindowDimension = modelPramas.thumbnailWindowDimension = {overflow: "hidden"};
    var thumbnailProxyDimension = modelPramas.thumbnailProxyDimension = {overflow: "hidden"};
    var thumbnailAdjustDimension = modelPramas.thumbnailAdjustDimension = {overflow: "hidden"}; 
    var animateRange = "";
    var isGrounp = false;
    var keyControl = "";
    
    switch (options.thumbnailMenuPosition){
      case "top":
      case "down":
        switch (options.slideWay) {
          case 1:
            thumbnailWindowDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * options.numsPerScreen - options.thumbnailsSpace;
            thumbnailWindowDimension.height = options.thumbnailHeight;
            thumbnailProxyDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * len;
            thumbnailProxyDimension.height =  options.thumbnailHeight;
            thumbnailAdjustDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * len - options.thumbnailsSpace;
            thumbnailAdjustDimension.height =  options.thumbnailHeight;
            animateRange = thumbnailWindowDimension.width + options.thumbnailsSpace;
            isGrounp = false;
            keyThumbnailControl = "scrollLeft";
            keyProxyControl = "width";
          break;
          case 2:
            thumbnailWindowDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * options.numsPerScreen - options.thumbnailsSpace;
            thumbnailWindowDimension.height = options.thumbnailHeight;
            thumbnailProxyDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * options.numsPerScreen;
            thumbnailProxyDimension.height =  options.thumbnailHeight * thumbnailScreenNum;
            thumbnailAdjustDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * options.numsPerScreen;
            thumbnailAdjustDimension.height =  options.thumbnailHeight * thumbnailScreenNum;
            animateRange = thumbnailWindowDimension.height;
            isGrounp = true;
            keyThumbnailControl = "scrollLeft";
            keyProxyControl = "height";
          break;
        }
        break;
      case "left":
      case "right":
        switch (options.slideWay) {
          case 1:
            thumbnailWindowDimension.width = options.thumbnailWidth;
            thumbnailWindowDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * options.numsPerScreen - options.thumbnailsSpace;
            thumbnailProxyDimension.width =  options.thumbnailWidth * thumbnailScreenNum;
            thumbnailProxyDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * len;
            thumbnailAdjustDimension.width =  options.thumbnailWidth * thumbnailScreenNum;
            thumbnailAdjustDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * len;
            animateRange = thumbnailWindowDimension.width;
            isGrounp = true;
            keyThumbnailControl = "scrollLeft";
            keyProxyControl = "width";
          break;
          case 2:
            thumbnailWindowDimension.width = options.thumbnailWidth;
            thumbnailWindowDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * options.numsPerScreen - options.thumbnailsSpace;
            thumbnailProxyDimension.width = options.thumbnailWidth;
            thumbnailProxyDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * len;
            thumbnailProxyDimension.width = options.thumbnailWidth;
            thumbnailProxyDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * len - options.thumbnailsSpace;
            animateRange = thumbnailWindowDimension.height + options.thumbnailsSpace;
            isGrounp = false;
            keyThumbnailControl = "scrollLeft";
            keyProxyControl = "height";
          break;
        }
        break;
        
    };
    modelPramas.isGrounp = isGrounp;
    modelPramas.animateRange = animateRange;
    modelPramas.keyThumbnailControl = keyThumbnailControl;
    modelPramas.keyProxyControl = keyProxyControl;
    return modelPramas;  
  };
  
  function makeThumbnailMenu(index, thumbnails, isGrounp){
    var imgStr = '<div class="thumbnail-wrap"></div>';
    if (index == 0) {
      thumbnails.push("<li>");
      thumbnails.push(imgStr);
    } else if(index == (len - 1)) {
      thumbnails.push(imgStr);
      thumbnails.push("</li>");
    } else if(isGrounp && ((index + 1) % options.numsPerScreen == 0)){
      thumbnails.push(imgStr);
      thumbnails.push("</li><li>");
    } else {
      thumbnails.push(imgStr);
    }
  };
  function freshDisplayState() {
    thumbnailElements.filter(".thumbnail-on").removeClass("thumbnail-on").end().eq(thumbnailIndex).addClass("thumbnail-on");
    thumbnailBtnFirst.toggleClass("thumbnail-btn-first-disable", screenIndex == 0);
    thumbnailBtnSecond.toggleClass("thumbnail-btn-second-disable", screenIndex == (thumbnailScreenNum - 1));
    if (isContainNormalWindow) {
      normalElements.eq(thumbnailIndex).siblings(":visible").fadeOut(500, function(){
        $(this).css({"z-index": "0"});
      });
      normalElements.eq(thumbnailIndex).fadeIn(500, function(){
        $(this).css({"z-index": "1"});
      });
    }
  }
  function switchScreen(prefix, animateRange){
    var animateProperty = {};
    var keyThumbnailControl = modelPramas.keyThumbnailControl;
    var animateRange = /^\d+$/i.test(animateRange)? animateRange : modelPramas.animateRange;
    
    preloadThumbnailImage();
    
  
    
    animateProperty[keyThumbnailControl] = prefix + animateRange;
    thumbnailWindow.animate(animateProperty, options.switchScreenSpeed, function(){
       
    });
  }
  function preloadThumbnailImage() {//isAllThumbnailLoaded numsPerScreen
    if (!isAllThumbnailLoaded) {
      for(var i = 0; i < options.numsPerScreen; i++ ) {
        //console.log("screenIndex" + screenIndex);
        var j = options.numsPerScreen * screenIndex + i;
        if ( j >= len ) break;
        (function(j){
          var el = thumbnailElements.eq(j);
          fetchImg(options.source[j].thumbnail,{
            initCallback: function(){
              el.addClass("loading");
            },
            loadCallback: function(){
              el.removeClass("loading").html(this);
             
            },
            errorCallback: function(){
              el.removeClass("loading");
            }
          })
          
          
        })(j);
        
      }
    }
    
    if (screenIndex == (thumbnailScreenNum -1 )){
      isAllThumbnailLoaded = true;
    }
  };
  function preloadNormalImage() {
    if (isContainNormalWindow) {
          
      var el = normalElements.eq(thumbnailIndex);
      fetchImg(options.source[thumbnailIndex].normal, {
          initCallback: function(){
            el.addClass("loading");
          },
          loadCallback: function(){
            el.removeClass("loading").html(this);
           
          },
          errorCallback: function(){
            el.removeClass("loading");
          }
      })  
    }
  };
  function preloadPreviewImage() {
    if (isContainPreviewWindow) {
      (function(index){
        fetchImg(options.source[index].preview, {
          initCallback: function(){
            previewWindow.html("");
            previewWindow.addClass("loading");
          },
          loadCallback: function(){
            if (index == thumbnailIndex) {
              previewWindow.removeClass("loading").html(this);
            }
            
           
          },
          errorCallback: function(){
            if (index == thumbnailIndex) {
              previewWindow.removeClass("loading");
            }
          }
        })
      })(thumbnailIndex);
        
    }
  };
  function autoSwitch() {
   
      var prefix = "";
      if (++thumbnailIndex >= len) {
        screenIndex = 0;
        thumbnailIndex = 0;
        switchScreen(prefix, 0);
      } 
      
      if (thumbnailIndex != 0 && ((thumbnailIndex + 1) % options.numsPerScreen == 1)) {// is or not switch screen;
        screenIndex = Math.floor((thumbnailIndex + 1) / options.numsPerScreen);
        prefix += "+=";
        switchScreen(prefix);
      }
       
      if (isContainNormalWindow) {
        
          var el = normalElements.eq(thumbnailIndex);
          fetchImg(options.source[thumbnailIndex].normal, {
            initCallback: function(){
              el.addClass("loading");
            },
            loadCallback: function(){
              el.removeClass("loading").html(this);
             
            },
            errorCallback: function(){
              el.removeClass("loading");
            }
        })  
      }
        
       freshDisplayState();
   
    
  };
  function setPreviewWindowPosition() {
    var style = {};
    var galleryOffset = galleryWraper.offset()
    if (galleryOffset.left + galleryWraper.width() / 2 <= $(window).width() / 2) {
      style.left = galleryOffset.left + galleryWraper.outerWidth() + 10;
    } else {
      style.left = galleryOffset.left - previewWindow.width() - 10;
    }
    style.top = galleryOffset.top;
    
    previewWindow.css(style);
    
  }
  function calCoordinate(e){
     var rslt = {};
     var offset = normalWindow.offset();
     rslt.left = Math.max(0, Math.min(e.pageX - offset.left - magnifier.width() / 2 , normalWindow.width() - magnifier.width()));
     rslt.top = Math.max(0, Math.min(e.pageY - offset.top - magnifier.height() / 2,  normalWindow.height() - magnifier.height()));
     
     return rslt;
  }
  function previewing(e){
    if (!previewWindow.is(":empty")) {
      var offset = calCoordinate(e);
      magnifier.css(calCoordinate(e));
      
      previewWindow.children().css({left: (-1) * offset.left * options.scale, top: (-1) * offset.top * options.scale});
    }
  }
  function bindEvent(modelPramas){
    thumbnailWindow.scrollLeft(0);
    thumbnailWindow.scrollTop(0);
    gallery
      .on("click.thumbnail", ".thumbnail-menu .thumbnail-btn", function(){
     
        var prefix = "";
        if ($(this).is(".thumbnail-btn-first")){
          screenIndex--;
          prefix += "-=";
        } else {
          screenIndex++;
          prefix += "+=";
        }
        
        if (screenIndex < 0) {
          screenIndex = 0;
        }
        
        if (screenIndex >= thumbnailScreenNum) {
          screenIndex = (thumbnailScreenNum -1);
        }
        
        switchScreen(prefix);
        freshDisplayState();
        
        
      })
      .on("click.thumbnail", ".thumbnail-wrap", function(){
        thumbnailIndex = thumbnailElements.index(this);
        normalElements.filter(":animated").stop(true, true);
        preloadNormalImage();
        
        freshDisplayState();
    })
      
    if (options.isAutoSwitchAble) {
      gallery
        .mouseenter(function(){
          clearInterval(timer);
        })
        .mouseleave(function(){
          timer = setInterval(autoSwitch, options.switchThumbnailTime);
        })
    }
    
    if (isContainPreviewWindow) {
      gallery
        .on("mouseenter", ".normal-window", function(){
          if ( previewWindow == null) {
            magnifier = $("<div class=\"gallery-magnifier\" />");
            magnifier.css({width: options.magnifierWidth, height: options.magnifierHeight});
            normalWindow.append(magnifier);
            
            previewWindow = $("<div class=\"preview-window\" />");
            previewWindow.css({width: options.magnifierWidth * options.scale, height: options.magnifierHeight * options.scale});
            setPreviewWindowPosition();
            $("body").append(previewWindow);
          } else if (previewWindow) {
            previewWindow.show();
            magnifier.show();
            setPreviewWindowPosition();
          }
          
          preloadPreviewImage();
        })
        .on("mouseleave", ".normal-window", function(){
          if (isContainPreviewWindow) {
            previewWindow.hide();
            magnifier.hide();
          }
        })
        .on("mousemove", ".normal-window", function(e){
          previewing(e);
        });
    }
      
    
  }
  
  init();
}
  
 module.exports = imageGallery; 
 })
