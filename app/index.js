const express = require('express');

const profilePictures = require('./profile-pictures');

const app = express();

/** Redirect to main website from root */
app.get('/', (req, res) => {
  res.redirect('https://arkis.io/');
});


/** Return a user's profile picture given their username */
app.get('/profile/:username', (req, res) => {
  const platform = req.query.platform || 'twitter';
  const username = req.params.username;
  if (!username) res.status(400).send('Error: Must provide a username');
  if (platform === 'twitter') profilePictures.getTwitterPicture(username, res);
});

app.listen(3000);
