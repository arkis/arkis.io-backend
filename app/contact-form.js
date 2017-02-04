const fs = require('fs');
const path = require('path');
const sendmail = require('sendmail')();


module.exports.send = (name, emailFrom, message, callback) => {
  const emailTemplate = fs.readFileSync(path.join(__dirname, './contact-message-template.html'), 'utf8');
  const htmlMessage = emailTemplate.replace(
    '[[first]]', name[0]
  ).replace(
    '[[last]]', name[1]
  ).replace(
    '[[email]]', emailFrom
  ).replace(
    '[[message]]', message
  );

  sendmail({
    from: 'contact@arkis.io',
    to: 'luke@deentaylor.com',
    subject: `Arkis contact form: ${name[0]} ${name[1]} (${emailFrom})`,
    html: htmlMessage,
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
