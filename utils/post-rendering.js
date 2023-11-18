function blogFeed(postsImgArr, recBlogs) {
  const cityObj = {};
  postsImgArr.forEach((Obj) => {
    for (const key in cityObj) {
      if (Obj.city == key) {
        cityObj[key] = [...cityObj[key], Obj];
      };
    };
    if (!cityObj[Obj.city]) {
      cityObj[Obj.city] = [Obj];
    };
    Obj.blogFeed = true;
    Obj.thumbnail = '\\' + Obj.thumbnail;
  });
  let objectOrder;
  if (recBlogs) {
    objectOrder = {
      'recBlogs': null
    };
  } else {
    objectOrder = {
      'noCity': null
    };
  };
  const cityObjReordered = Object.assign(objectOrder, cityObj);
  let randomArr = [];
  for (const key in cityObj) {
    function getMultipleRandom(arr, num) {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());

      return shuffled.slice(0, num);
    };
    if (cityObj[key] !== "noCity" && cityObj[key] !== "recBlogs") {
      randomArr = [...randomArr, ...getMultipleRandom(cityObj[key], 3)];
    };
  };
  if(recBlogs){
    cityObjReordered.recBlogs = randomArr.sort(() => Math.random() - 0.5);
  }else {
    cityObjReordered.noCity = randomArr.sort(() => Math.random() - 0.5);
  };
  return cityObjReordered;
};

module.exports = { blogFeed };