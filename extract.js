const posts = require('./data-files/likedPosts1.json');
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
const allVideos = [];
posts.forEach((post) => {

  // photos
  // if (post.type === 'photo') {
  //   post.photos.forEach((photo) => {
  //     const url = photo.original_size.url;
  //     const filename = `${post.liked_timestamp}-${url.match(/\w+\.\w+$/)}`;
  //     const photoData = {
  //       url,
  //       filename
  //     };
  //     allPhotos.push(photoData);
  //   });
  // }

  // videos
  if (post.type === 'video') {
    const url = post.video_url || ''; // apparently sometimes video url is missing
    const filename = `${post.liked_timestamp}-${url.match(/\w+\.\w+$/)}`;
    const videoData = {
      url,
      filename
    };
    allVideos.push(videoData);
  }

});

// write photos
// console.log(`extracted ${allPhotos.length} photos`);
// fs.writeFileSync('./data-files/allPhotos.json', JSON.stringify(allPhotos, null, 2));

// write videos
console.log(`extracted ${allVideos.length} videos`);
fs.writeFileSync('./data-files/allVideos.json', JSON.stringify(allVideos, null, 2));