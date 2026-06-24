const { Jimp } = require('jimp');
async function run() {
  const image = await Jimp.read('public/logo-alfred-white.png');
  const size = image.bitmap.height;
  image.crop({ x: 0, y: 0, w: size, h: size });
  await image.write('public/favicon.png');
  console.log('Cropped successfully!');
}
run();
