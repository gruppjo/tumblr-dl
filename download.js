const download = require('download');
const allPhotos = require('./data-files/allPhotos.json');

const downloadPromisesSet = async (promises) => {
  return Promise.all(promises)
  .then(() => {
    console.log(`downloaded set - ${index} of ${allPhotos.length}`);
  });
};

let index = 0;
const downloadPhotos = async () => {
  while (index < allPhotos.length) {

    const remainingPhotosCount = allPhotos.length - 1 - index;
    const CONCURRENCY_COUNT = remainingPhotosCount >= 50 ? 50 : remainingPhotosCount;

    const promises = [];
    for (let innerIndex = 0; innerIndex < CONCURRENCY_COUNT; innerIndex++) {
      const photo = allPhotos[index + innerIndex];
      promises.push(download(photo.url, `tumblr-files`, {
        filename: photo.filename
      }));
      console.log(`downloading ${photo.filename}`);
    }

    await downloadPromisesSet(promises);

    index += CONCURRENCY_COUNT;
  }
};

downloadPhotos();
