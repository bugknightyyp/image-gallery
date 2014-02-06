   //the act of switching screen
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
   
    
  }