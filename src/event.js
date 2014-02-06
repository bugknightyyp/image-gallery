  //bind necessary events
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
      

      
  }