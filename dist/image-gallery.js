define(function(require, exports, module){
var $ = require("jquery");
var imageGallery = function(options) {  
  var 
    _this = this,
    
    galleryWraper = null, 
    gallery,
    
    normalWindow = null,
    normalElements = null,
    isContainNormalWindow = false,
    
    thumbnailMenu,
    thumbnailBtnFirst,
    thumbnailBtnSecond ,
    thumbnailWindow,
    //thumbnailsWraper ,
    thumbnailElements = null,
    
    
    len = 0,
    thumbnailScreenNum = 0,
    thumbnailIndex = 0,
    screenIndex = 0,
    isAllThumbnailLoaded = false,
    
    
    previewWindow = null,
    isContainPreviewWindow = false,
    
    magnifier = null,
    
    describeWindow = null,
    isContainDescribeWindow = false,
    
    timer = null,
    
    modelParams = null;
  
  
  //init parameters or variables 
  options = $.extend({
    wraperID: null,
    source: [], //{thumbnail: "", normal: "", preview: "", describe: ""}
    slideWay: "top-bottom", //the way of toggle screen。1: left-right; 2: up-bottom
    thumbnailWidth: 80, 
    thumbnailHeight: 50,
    thumbnailsSpace: 10,
    numsPerScreen: 4, // the numbers of thumbnail per screen
    thumbnailMenuPosition: "bottom",// preview menu positon relative to the gallery window , the value can is one of left, right, top ,bottom;
    isAutoSwitchAble: true, // Whether or not the thumbnail automatic switching
    isShowPauseBtn: false,
    isShowThumbnailIndex: false,
    switchScreenSpeed: 100,
    switchThumbnailTime: 3000,
    magnifierWidth: 200,
    magnifierHeight: 200,
    scale: 2
  }, options || {});
  //find image gallery container
  
  function initParameters(){
    if (options.wraperID && /^[\w-]+$/i.test(options.wraperID)) {
      galleryWraper = $("#" + options.wraperID);
    } else if (_this && _this[0].nodeType == 1) {
      galleryWraper = _this;
      _this = null;
    } else {
      throw new Error("please specify a HTMLElement or wraperID for image gallery");
    }
    
    len = options.source.length;
    thumbnailScreenNum = Math.ceil(len / options.numsPerScreen)
    
    //
    isContainNormalWindow = typeof options.source[0].normal === 'undefined'? false : true;
    

    isContainPreviewWindow = typeof options.source[0].preview === 'undefined'? false : true;

    isContainDescribeWindow = typeof options.source[0].describe === 'undefined'? false : true;
    isContainDescribeWindow &&  (function(){describeWindow = $('<div class="describe-window" />')})();
    
    modelParams = getModelParams(len, options);
  }
  
  
  
  ;   
   // make thumbnail construct
  
  
 function initStructure(len, isContainNormalWindow, modelParams, options) {
    var
      gallery = $("<div class=\"image-gallery\" />"),
      
      normalWindow,
      
      thumbnailMenu = $("<div class=\"thumbnail-menu\" />"),
      thumbnailBtnFirst = $('<div class="thumbnail-btn thumbnail-btn-first"></div>'),
      thumbnailBtnSecond = $('<div class="thumbnail-btn thumbnail-btn-second"></div>'),
      
      thumbnailWindow = $("<div class=\"thumbnail-window\" />"),
      thumbnailAdjust = $("<div class=\"thumbnail-adjust\" />"),
      thumbnailsWraper = $("<ul />"),
      thumbnails = [];
      
    isContainNormalWindow &&  (normalWindow = $('<div class="normal-window"><ul></ul></div>'));
    function makeThumbnailMenu(index, thumbnails, isGrounp, numsPerScreen){
      var imgStr = '<div class="thumbnail-wrap"></div>';
      if (index == 0) {
        thumbnails.push("<li>");
        thumbnails.push(imgStr);
      } else if(index == (len - 1)) {
        thumbnails.push(imgStr);
        thumbnails.push("</li>");
      } else if(isGrounp && ((index + 1) % numsPerScreen == 0)){
        thumbnails.push(imgStr);
        thumbnails.push("</li><li>");
      } else {
        thumbnails.push(imgStr);
      }
    }
    
    for (var i = 0; i< len; i++) {
        isContainNormalWindow && normalWindow.children("ul").append("<li />");
        makeThumbnailMenu(i, thumbnails, modelParams.isGrounp, options.numsPerScreen);
    }
    
    thumbnailsWraper
      .append(thumbnails.join(''))
      .css(modelParams.thumbnailsWraperDimension)
      .children().css({float: "left"}).children()
        .css({"width": options.thumbnailWidth,
              "height": options.thumbnailHeight, 
              "margin-right": options.thumbnailsSpace
             });
    thumbnailAdjust.css(modelParams.thumbnailAdjustDimension);
    thumbnailAdjust.append(thumbnailsWraper);   
    thumbnailWindow.append(thumbnailAdjust).css(modelParams.thumbnailWindowDimension);
    thumbnailMenu.append(thumbnailBtnFirst);
    thumbnailMenu.append(thumbnailBtnSecond);
    thumbnailMenu.append(thumbnailWindow);
    
    //thumbnailElements = thumbnailProxy.find("li > div");
    
    //normalElements = normalWindow.find("ul li");
    switch (options.thumbnailMenuPosition) {
      case "top":
      case "left":
        gallery.append(thumbnailMenu);
        gallery.append(isContainNormalWindow && normalWindow);
        break;
      case "bottom":
      case "right":
        gallery.append(isContainNormalWindow && normalWindow);
        gallery.append(thumbnailMenu);
        break;
    }
    
    return gallery;
    //galleryWraper.html(gallery);
};  //get parameters about difference model
  function getModelParams(thumbnailNums, options){
    if (!/^(top|bottom|left|right)$/i.test(options.thumbnailMenuPosition)) {
      throw new Error("the value of options.thumbnailMenuPosition must is one of top, bottom, left, right");
    }
    if (!/^(left\-right|top\-bottom)$/i.test(options.slideWay)) {
      throw new Error("the value of options.slideWay must is one of left-right, top-bottom");
    }
  
    var 
      thumbnailScreenNum = 0,
      modelParams = {},
      thumbnailWindowDimension = modelParams.thumbnailWindowDimension = {},
      thumbnailsWraperDimension = modelParams.thumbnailsWraperDimension = {},
      thumbnailAdjustDimension = modelParams.thumbnailAdjustDimension = {}, //to subtraction the space of last thumnail
      animateRange = "",
      isGrounp = false,
      keyThumbnailControl = "",
      keyWrapeControl = "";
    thumbnailScreenNum = Math.ceil(thumbnailNums / options.numsPerScreen );
    switch (options.thumbnailMenuPosition){
      case "top":
      case "bottom":
        switch (options.slideWay) {
          case "left-right":
            thumbnailWindowDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) 
              * options.numsPerScreen - options.thumbnailsSpace;
            thumbnailWindowDimension.height = options.thumbnailHeight;
            thumbnailsWraperDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * thumbnailNums;
            thumbnailsWraperDimension.height =  options.thumbnailHeight;
            thumbnailAdjustDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * thumbnailNums - options.thumbnailsSpace;
            thumbnailAdjustDimension.height =  options.thumbnailHeight;
            animateRange = thumbnailWindowDimension.width + options.thumbnailsSpace;
            isGrounp = false;
            keyThumbnailControl = "scrollLeft";
            keyWrapeControl = "width";
            break;
          case "top-bottom":
            thumbnailWindowDimension.width = (options.thumbnailWidth + options.thumbnailsSpace)
              * options.numsPerScreen - options.thumbnailsSpace;
            thumbnailWindowDimension.height = options.thumbnailHeight;
            thumbnailsWraperDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * options.numsPerScreen;
            thumbnailsWraperDimension.height =  options.thumbnailHeight * thumbnailScreenNum;
            thumbnailAdjustDimension.width = (options.thumbnailWidth + options.thumbnailsSpace) * options.numsPerScreen;
            thumbnailAdjustDimension.height =  options.thumbnailHeight * thumbnailScreenNum;
            animateRange = thumbnailWindowDimension.height;
            isGrounp = true;
            keyThumbnailControl = "scrollTop";
            keyWrapeControl = "height";
            break;
        }
        break;
      case "left":
      case "right":
        switch (options.slideWay) {
          case "left-right":
            thumbnailWindowDimension.width = options.thumbnailWidth;
            thumbnailWindowDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) 
              * options.numsPerScreen - options.thumbnailsSpace;
            thumbnailsWraperDimension.width =  options.thumbnailWidth * thumbnailScreenNum;
            thumbnailsWraperDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * options.numsPerScreen;
            thumbnailAdjustDimension.width =  options.thumbnailWidth * thumbnailScreenNum;
            thumbnailAdjustDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * options.numsPerScreen;
            animateRange = thumbnailWindowDimension.width;
            isGrounp = true;
            keyThumbnailControl = "scrollLeft";
            keyWrapeControl = "width";
            break;
          case "top-bottom":
            thumbnailWindowDimension.width = options.thumbnailWidth;
            thumbnailWindowDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) 
              * options.numsPerScreen - options.thumbnailsSpace;
            thumbnailsWraperDimension.width = options.thumbnailWidth;
            thumbnailsWraperDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * thumbnailNums;
            thumbnailAdjustDimension.width = options.thumbnailWidth;
            thumbnailAdjustDimension.height = (options.thumbnailHeight + options.thumbnailsSpace) * thumbnailNums - options.thumbnailsSpace;
            animateRange = thumbnailWindowDimension.height + options.thumbnailsSpace;
            isGrounp = false;
            keyThumbnailControl = "scrollTop";
            keyWrapeControl = "height";
            break;
        }
        break;
        
    };
    
    modelParams.isGrounp = isGrounp;
    modelParams.animateRange = animateRange;
    modelParams.keyThumbnailControl = keyThumbnailControl;
    modelParams.keyWrapeControl = keyWrapeControl;
    
    return modelParams;  
  };  // refresh the states of thumbnail, button and normal image when thumbnail is switched.
 
  
  function freshThumbnailMenuState(){
    thumbnailElements.filter(".thumbnail-on").removeClass("thumbnail-on").end().eq(thumbnailIndex).addClass("thumbnail-on");
    thumbnailBtnFirst.toggleClass("thumbnail-btn-first-disable", screenIndex == 0);
    thumbnailBtnSecond.toggleClass("thumbnail-btn-second-disable", screenIndex == (thumbnailScreenNum - 1));
  }
  function freshNormalWindowState(){
    if (isContainNormalWindow) {
      normalElements.filter(":animated").stop(true, true);
      normalElements.filter(function(){
        return $(this).css("z-index") == "1";
      }).animate({opacity: 0}, 1000, function(){
        $(this).css({"z-index": "0"});
      });
      normalElements.eq(thumbnailIndex).animate({opacity: 1}, 1000, function(){
        $(this).css({"z-index": "1"});
      });
    }
  }
  function freshAllstate(){
    freshThumbnailMenuState();
    freshNormalWindowState();
  }
  ;   //the act of switching screen
  function switchScreen(prefix, animateRange){
    var animateProperty = {};
    var keyThumbnailControl = modelParams.keyThumbnailControl;
    var animateRange = /^\d+$/i.test(animateRange)? animateRange : modelParams.animateRange;
    
    preloadThumbnailImage();
    
    animateProperty[keyThumbnailControl] = prefix + animateRange;
    thumbnailWindow.animate(animateProperty, options.switchScreenSpeed, function(){
       
    });
  }
  //auto switch thumnail image
  function autoSwitch() {
      var prefix = "";
      if (++thumbnailIndex >= len) {
        screenIndex = 0;
        thumbnailIndex = 0;
        switchScreen(prefix, 0);//recover to start point
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
        
       freshAllstate();
   
    
  };  // set preview window position
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
  
  // calculate magnifier' coordinate relative normal window
  function calCoordinate(e){
     var rslt = {};
     var offset = normalWindow.offset();
     rslt.left = Math.max(0, Math.min(e.pageX - offset.left - magnifier.width() / 2 , normalWindow.width() - magnifier.width()));
     rslt.top = Math.max(0, Math.min(e.pageY - offset.top - magnifier.height() / 2,  normalWindow.height() - magnifier.height()));
     
     return rslt;
  }
  
  //locate the image in preview window
  function previewing(e){
    if ( previewWindow && !previewWindow.is(":empty")) {
      var offset = calCoordinate(e);
      magnifier.css(calCoordinate(e));
      
      previewWindow.children().css({left: (-1) * offset.left * options.scale, top: (-1) * offset.top * options.scale});
    }
  };  //load image
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
  }
  
  //load thumbnail image when need
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
  }
  
  //load naomal image when need
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
  }
  
  //load preview image when need
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
  };  //bind necessary events
  function bindEvent(modelParams){
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
        freshThumbnailMenuState();
        
        
      })
      .on("click.thumbnail", ".thumbnail-wrap", function(){
        thumbnailIndex = thumbnailElements.index(this);
        normalElements.filter(":animated").stop(true, true);
        preloadNormalImage();
        
        freshAllstate();
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
      

      
  };




  //start image gallery
  initParameters();
  gallery = initStructure(len, isContainNormalWindow, modelParams, options);
  
  normalWindow = gallery.find(".normal-window");
  normalElements = normalWindow.find("ul li");
  
  thumbnailWindow = gallery.find(".thumbnail-window");
  thumbnailElements = thumbnailWindow.find("ul li > div");
  
  thumbnailBtnFirst = gallery.find(".thumbnail-menu .thumbnail-btn-first");
  thumbnailBtnSecond = gallery.find(".thumbnail-menu .thumbnail-btn-second");
  
  freshAllstate();
  
  bindEvent(modelParams);
  preloadThumbnailImage();
  
  if (options.isAutoSwitchAble) {
    timer = setInterval(autoSwitch, options.switchThumbnailTime);
  }
  preloadNormalImage();

  galleryWraper.html(gallery);}
  $.fn.imageGallery = imageGallery;
  module.exports = imageGallery;
})