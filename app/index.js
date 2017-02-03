const express = require('express');
const bodyParser = require('body-parser');

const profilePictures = require('./profile-pictures');
const contactForm = require('./contact-form');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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

app.post('/contact', (req, res) => {
  const name = [req.body.firstName || '', req.body.lastName || ''];
  const emailFrom = req.body.email || '';
  const message = req.body.message || '';
  contactForm.send(name, emailFrom, message, r => res.send(r));
});

const args = process.argv.slice(2);
const port = args.length ? args[0] : 3000;
console.log(`Now listening at 0.0.0.0:${port}`);
app.listen(port, '0.0.0.0');
