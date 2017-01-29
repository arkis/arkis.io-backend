const fs = require('fs');
const path = require('path');
const request = require('request');
const express = require('express');


const app = express();

/** Return a user's profile picture given their username */
app.get('/profile/:username', (req, res) => {
  const platform = req.query.platform || 'twitter';
  const username = req.params.username;

  if (!username) {
    res.status(400).send('Error: Must provide a username');
  }

  // Resolve redirect from https://twitter.com/USERNAME/profile_image?size=original
  if (platform === 'twitter') {
    const url = `https://twitter.com/${username}/profile_image`;
    const filename = path.join(__dirname, `../cache/${username}.jpg`);

    // If the profile image is cached and it's been less than an hour since it was written to,
    // return that cached version.
    if (fs.existsSync(filename) && new Date() - fs.statSync(filename).mtime < 3600000) {
      console.log(`${new Date()}: found cached avatar for ${username}`);
      fs.createReadStream(filename).pipe(res);
      return;
    }
    // If it's been more than an hour or the profile image isn't cached, fetch it, cache it, and
    // return it
    else {
      console.log(`${new Date()}: fetching avatar for ${username}`);

      // Request the file
      request(url, (e, requestResponse) => {
        const newURL = requestResponse.request.uri.href; // Follow redirect
        const squareURL = newURL.replace('_normal', '_400x400'); // Manipulate the URL for a larger size

        const r = request(squareURL); // Request new URL
        const file = fs.createWriteStream(filename); // Write the image to a file
        r.pipe(file);
        file.on('finish', () => { // When that's done, return the file's contents
          fs.createReadStream(filename).pipe(res);
        })
      });
    }
  }
});

app.listen(3000);
