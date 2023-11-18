const base64ToImage = require('base64-to-image');

function base64Converter(base64, imgPath, options) {
  return new Promise(async (resolve, reject) => {
    resolve(await base64ToImage(base64, imgPath, options));
  });
};
function blogImages(html, imgDataArr) {
  return new Promise(async (resolve, reject) => {
    for (i = 0; i < imgDataArr.length; i++) {
      const imgObj = imgDataArr[i];
      const imgRelPath = '/public/img/blog-img/' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '-';
      const imgPath = '.' + imgRelPath;
      const imgSrc = imgRelPath + 'image.png';
      const imgInfo = await base64Converter(imgObj.base64, imgPath, { 'fileName': 'image', 'type': 'png' });
      if (Object.keys(imgInfo).length > 0) {
        html = html.replace(imgObj.src, imgSrc);
      };
    };
    resolve(html);
  });
};

module.exports = blogImages;