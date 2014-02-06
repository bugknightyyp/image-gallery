module("get model parameters");


test("the way consist of bottom/top and left-right", function(){
  //bottom/top  left-right
  var len = 15;
  var actual_1 = getModelParams(len, {
        thumbnailMenuPosition: "bottom",
        slideWay: "left-right",
        thumbnailWidth: 100,
        thumbnailHeight: 50,
        thumbnailsSpace: 10,
        numsPerScreen: 4
      }
      
  );
  
  var should_1 = {
    animateRange: (100 + 10) * 4,
    isGrounp: false,
    keyThumbnailControl: "scrollLeft",
    keyWrapeControl: "width",
    thumbnailWindowDimension: {
      width: (100 + 10) * 4 - 10,
      height: 50 
    },
    thumbnailsWraperDimension: {
      width: (100 + 10) * 15,
      height: 50 
    },
    thumbnailAdjustDimension: {
      width: (100 + 10) * 15 - 10,
      height: 50
    }
  };
  
  deepEqual(actual_1, should_1, "bottom/top  and left-right");
  
  
  
 
});

test("the way consist of bottom/top and top-bottom", function(){
  var len = 15;
  
  //bottom/top  top-bottom
  var actual_2 = getModelParams(len, {
        thumbnailMenuPosition: "bottom",
        slideWay: "top-bottom",
        thumbnailWidth: 100,
        thumbnailHeight: 50,
        thumbnailsSpace: 10,
        numsPerScreen: 4
      }
      
  );
  var should_2 = {
    animateRange: 50,
    isGrounp: true,
    keyThumbnailControl: "scrollTop",
    keyWrapeControl: "height",
    thumbnailWindowDimension: {
      width: (100 + 10) * 4 - 10,
      height: 50 
    },
    thumbnailsWraperDimension: {
      width: (100 + 10) * 4,
      height:  50 * Math.ceil(15 / 4),
    },
    thumbnailAdjustDimension: {
      width: (100 + 10) * 4,
      height: 50 * Math.ceil(15 / 4),
    }
  };
  
  deepEqual(actual_2, should_2, "bottom/top  and top-bottom");
  
 
});

test("the way consist of left/right and left-right", function(){
  //left/right  left-right
  var len = 15;
  var actual_1 = getModelParams(len, {
        thumbnailMenuPosition: "left",
        slideWay: "left-right",
        thumbnailWidth: 100,
        thumbnailHeight: 50,
        thumbnailsSpace: 10,
        numsPerScreen: 4
      }
      
  );
  var should_1 = {
    animateRange: 100,
    isGrounp: true,
    keyThumbnailControl: "scrollLeft",
    keyWrapeControl: "width",
    thumbnailWindowDimension: {
      width: 100,
      height: (50 + 10) * 4 - 10 
    },
    thumbnailsWraperDimension: {
      width: 100 * Math.ceil( 15 / 4),
      height: (50 + 10) * 4 
    },
    thumbnailAdjustDimension: {
      width: 100 * Math.ceil( 15 / 4),
      height: (50 + 10) * 4 
    }
  };
  
  deepEqual(actual_1, should_1, "left/right  and left-right");
  
  
  
  
});

test("the way consist of left/right and top-bottom", function(){
  var len = 15;
  
  //left/right  top-bottom
  var actual_2 = getModelParams(len, {
        thumbnailMenuPosition: "left",
        slideWay: "top-bottom",
        thumbnailWidth: 100,
        thumbnailHeight: 50,
        thumbnailsSpace: 10,
        numsPerScreen: 4
      }
      
  );
  var should_2 = {
    animateRange: (50 + 10) * 4,
    isGrounp: false,
    keyThumbnailControl: "scrollTop",
    keyWrapeControl: "height",
    thumbnailWindowDimension: {
      width: 100,
      height: (50 + 10) * 4 - 10 
    },
    thumbnailsWraperDimension: {
      width: 100,
      height:  (50 + 10) * 15,
    },
    thumbnailAdjustDimension: {
      width: 100,
      height: (50 + 10) * 15 - 10,
    }
  };
  
  deepEqual(actual_2, should_2, "left/right  and top-bottom");
  
  
});

test("throw errors", function(){
  throws(function(){
      getModelParams("bottomfsfs", "left-right", 100, 50, 10, 15, 4)
    }, 
    Error,
    "throw info: the value of thumbnailMenuPosition must is one of top, bottom, left, right");
  throws(function(){
      getModelParams("bottom", "leftright", 100, 50, 10, 15, 4)
    }, 
    Error,
    "throw info: the value of slideWay must is one of left-right, top-bottom");
});