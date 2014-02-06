




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

  galleryWraper.html(gallery);