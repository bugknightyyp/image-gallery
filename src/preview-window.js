  // set preview window position
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
  }