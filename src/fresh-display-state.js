  // refresh the states of thumbnail, button and normal image when thumbnail is switched.
 
  
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
  