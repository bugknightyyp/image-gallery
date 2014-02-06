   
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
}