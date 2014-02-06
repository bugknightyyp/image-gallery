  //load image
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
  }