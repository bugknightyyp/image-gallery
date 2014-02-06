  
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
  
  
  
  