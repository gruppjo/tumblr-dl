# tumblr-likes-dl
nodejs implementation to download all your tumblr likes (photo, text & video posts) chronologically in the order you liked them - based on [tumblr api v2](https://www.tumblr.com/docs/en/api/v2), uses [tumblr.js](https://github.com/tumblr/tumblr.js) to perform requests against tumblr api. Very much WIP. Hacked together quickly.

Quick guide:
- [node.js](https://nodejs.org/en/)
- clone or dl this repo: git@github.com:gruppjo/tumblr-dl.git
- `npm install`
- visit https://www.tumblr.com/oauth/apps
  - register an application
  - authenticate application
  - click little explore Explore API link
- you're navigated to https://api.tumblr.com/console/calls/user/info
  - click 'Show keys' on top right
- create `secrets.json` and fill in information from previous site (Do not share this with anyone!)
```json
{
  "consumer_key": "aosdjfojLKFDFKFMDpofJDOFI29834jp9",
  "consumer_secret": "s9d8fasafajsidjOIJA)(D92834jfF(Jj990349",
  "token": "aosdjfojLKFDFKFMDpasdfasfasfdofJDOFI29834jp9",
  "token_secret": "Gss3T6dTcNNZcCs9d8fasafajsidjOIJAZyCDguorqJQAiGRZplc"
}
```
- run `node index.js`
  - this will download all the json data for your liked posts and save it into `data-files/likedPosts.json` (you might hit tumblr request limits if you have a lot of data.)
- run `node extract.js`
  - this creates `data-files/allPhotos.json`, `data-files/allTexts.json`, `data-files/allVideos.json`
- run `node download.js`
  - this downloads all the content to your harddrive in a `tumblr-files` folder


### Todos
- Feature
  - DL followed blogs and other meta-data
- Improvements
  - name the download folders better
  - Improve documentation so it's clearer why we need to do certain things
    - Had issues placing the API call directly, wouldn't give me certain videos and content via Postman (with `/user/likes`)
    - `tumblr.js` callback API didn't work with passing in options
