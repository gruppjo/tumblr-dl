const tumblr = require('tumblr.js');
const http = require('http');
const https = require('https');
const fs = require('fs');
const secrets = require('./secrets.json');

// store a reference to the original request function
let originalRequest = http.request;
// override the function
http.request = function wrapMethodRequest(req) {
  console.log(req);
  // do something with the req here
  // ...
  // call the original 'request' function
  return originalRequest.apply(this, arguments);
}
originalRequest = https.request;
// override the function
https.request = function wrapMethodRequest(req) {
  console.log(req.href);
  // do something with the req here
  // ...
  // call the original 'request' function
  return originalRequest.apply(this, arguments);
}

const client = tumblr.createClient({
  ...secrets,
  returnPromises: true
});

const accLikedPosts = [];

const handleRequest = (response) => {
  const queryParams = response
    && response._links
    && response._links.next.query_params;
  const likedPosts = response
    && response.liked_posts;
  const morePosts = likedPosts
    && likedPosts.length != 0;

  if (likedPosts) {
    // some logging
    console.log(queryParams);
    console.log(likedPosts.length);
    likedPosts.forEach(post => {
      console.log(post.blog_name);
    });
    // add to array
    accLikedPosts.push(...likedPosts);
    // write to file
    fs.writeFileSync('./data-files/likedPosts.json', JSON.stringify(accLikedPosts, null, 2), { encoding: 'utf-8' });
  }

  return new Promise((resolve, reject) => {
    if (response && !morePosts) { // we reached the end
      resolve(likedPosts);
    }
    else {
      resolve(
        client.userLikes(queryParams ? queryParams : undefined)
        .then((response) => {
          return handleRequest(response);
        })
      )
    }
  })
};

handleRequest()
.then((allLikedPosts) => {
  console.log('done');
});

// initial implementation
// client.userLikes((response) => {
//   response.liked_posts.length;
//   response.liked_posts.forEach(post => {
//     console.log(post.blog_name);
//   });
//   return client.userLikes(response._links.next.query_params);
// })
// .then((response) => {
//   response.liked_posts.length;
//   response.liked_posts.forEach(post => {
//     console.log(post.blog_name);
//   });
//   return client.userLikes(response._links.next.query_params);
// })
// .then((response) => {
//   response.liked_posts.length;
//   response.liked_posts.forEach(post => {
//     console.log(post.blog_name);
//   })
// });