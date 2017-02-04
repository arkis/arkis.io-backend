const url = require('url');
const sendmail = require('sendmail')();


const localUrl = process.env.NOW_URL || 'https://arkis.io/';
const hostname = url.parse(localUrl).hostname;

module.exports.send = (name, emailFrom, message, callback) => {
  sendmail({
    from: `contact@${hostname}`,
    to: 'luke@deentaylor.com',
    subject: `Arkis contact form: ${name[0]} ${name[1]} (${emailFrom})`,
    html: message,
  }, (err, reply) => {
    if (err) {
      console.log("ERROR");
      console.log(err);
      callback(false);
    } else {
      console.log('Email sent');
      callback(true);
    }
  });
};
