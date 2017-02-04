const sendmail = require('sendmail')();


module.exports.send = (name, emailFrom, message, callback) => {
  sendmail({
    from: 'contact@arkis.io',
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
