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
const allTexts = [];
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

  // text
  if (post.type === 'text') {
    let body = post.body.replace('\"', '"');
    const regex = /https?:\/\/([\w.]+\/)+(\w+\.\w{2,6})/g;

    function getMatches(string, regex) {
      var matches = [];
      var match;
      while (match = regex.exec(string)) {
        matches.push(match);
      }
      return matches;
    }

    const matches = getMatches(body, regex);
    const files = matches.map((match) => {
      const url = match[0];
      const originalFilename = match[2];
      const filename = `${post.liked_timestamp}-${match[2]}`;
      body = body.replace(url, `./${filename}`)
      return {
        url,
        filename
      }
    });
    allTexts.push({
      name: post.liked_timestamp,
      body,
      files
    });
  }

});

// write photos
console.log(`extracted ${allPhotos.length} photos`);
fs.writeFileSync('./data-files/allPhotos.json', JSON.stringify(allPhotos, null, 2));

// write videos
console.log(`extracted ${allVideos.length} videos`);
fs.writeFileSync('./data-files/allVideos.json', JSON.stringify(allVideos, null, 2));

// write texts
console.log(`extracted ${allTexts.length} texts`);
fs.writeFileSync('./data-files/allTexts.json', JSON.stringify(allTexts, null, 2));