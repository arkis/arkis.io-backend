const os = require('os');
const fs = require('fs');
const path = require('path');

const request = require('request');


module.exports.getTwitterPicture = (username, outStream) => {
  const url = `https://twitter.com/${username}/profile_image`;
  const filename = path.join(os.tmpdir(), `${username}.jpg`);

  // If the profile image is cached and it's been less than an hour since it was written to,
  // return that cached version.
  if (fs.existsSync(filename) && new Date() - fs.statSync(filename).mtime < 3600000) {
    console.log(`${new Date()}: found cached avatar for ${username}`);
    fs.createReadStream(filename).pipe(outStream);
    return;
  }
  // If it's been more than an hour or the profile image isn't cached, fetch it, cache it, and
  // return it
  else {
    console.log(`${new Date()}: fetching avatar for ${username}`);

    // Resolve redirect from https://twitter.com/USERNAME/profile_image
    request(url, (e, requestResponse) => {
      const newURL = requestResponse.request.uri.href; // Follow redirect
      const squareURL = newURL.replace('_normal', '_400x400'); // Manipulate the URL for a larger size

      const r = request(squareURL); // Request new URL
      const file = fs.createWriteStream(filename); // Write the image to a file
      r.pipe(file);
      return file;
      file.on('finish', () => { // When that's done, return the file's contents
        fs.createReadStream(filename).pipe(outStream);
      })
    });
  }
}
