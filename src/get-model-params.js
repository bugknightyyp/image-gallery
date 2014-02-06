  //get parameters about difference model
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
  }