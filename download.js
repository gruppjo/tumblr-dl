const download = require('download');
const fs = require('fs');
const allPhotos = require('./data-files/allPhotos.json');
const allVideos = require('./data-files/allVideos.json');
const allTexts = require('./data-files/allTexts.json');

const OFFSET = 0;
const CONCURRENT_ITEMS = 50;

const downloadPromisesSet = async (promises, allItems, index, name) => {
  return Promise.all(promises)
  .then(() => {
    console.log(`downloaded set - ${index} of ${allItems.length} ${name}`);
  })
};

/**
 *
 * @param {*} allItems
 * @param {String} name just for better logging
 */
const downloadAll = async (allItems, name) => {

  let index = OFFSET | 0; // can also be used as offset
  // index=3600 means the image with index 3600 will be downloaded next
  // it doesn't mean it has already been downloaded
  while (index < allItems.length) {

    const remainingItemsCount = allItems.length - index;
    const concurrencyCount = remainingItemsCount >= CONCURRENT_ITEMS ? CONCURRENT_ITEMS : remainingItemsCount;

    const promises = [];
    for (let innerIndex = 0; innerIndex < concurrencyCount; innerIndex++) {
      const item = allItems[index + innerIndex];
      promises.push(download(item.url, `tumblr-files`, {
        filename: item.filename
      })
      .catch((err) => {
        console.log(`ERROR ${name}`, err && err.url);
      }));
      console.log(`downloading ${name} ${item.filename}`);
    }

    index += concurrencyCount; // add one more than the last downloaded index

    await downloadPromisesSet(promises, allItems, index, name);
  }
};

downloadAll(allPhotos, 'photos');
downloadAll(allVideos, 'videos');

const allTextsFiles = [];
allTexts.forEach((text) => {
  allTextsFiles.push(...text.files);
  console.log(`writing ${text.name}.html`);
  fs.writeFileSync(`./tumblr-files/${text.name}.html`, text.body);
});
downloadAll(allTextsFiles, 'textFiles');

