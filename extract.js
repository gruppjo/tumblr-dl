const posts = require('./data-files/likedPosts1.json');
const download = require('download');
const fs = require('fs');

console.log(posts.length, 'total');
const types = {};
let total = 0;

// count types
posts.forEach((post) => {
  total++;
  if (types[post.type]) {
    types[post.type] += 1;
  }
  else {
    types[post.type] = 1;
  }
});

console.log('post types', JSON.stringify(types, null, 2));

// extract data
const allPhotos = [];
posts.forEach((post) => {

  // photos
  if (post.type === 'photo') {
    post.photos.forEach((photo) => {
      const url = photo.original_size.url;
      const filename = `${post.liked_timestamp}-${url.match(/\w+\.\w+$/)}`;
      const photoData = {
        url,
        filename
      };
      allPhotos.push(photoData);
    });
  }

});
console.log(`extracted ${allPhotos.length} photos`);
fs.writeFileSync('./data-files/allPhotos.json', JSON.stringify(allPhotos, null, 2));