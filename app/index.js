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
    request(url, (e, requestResponse) => {
      const newURL = requestResponse.request.uri.href;
      const squareURL = newURL.replace('_normal', '_400x400');
      request(squareURL).pipe(res);
    });
  }
});

app.listen(3000);
