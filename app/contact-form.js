const fs = require('fs');
const path = require('path');

const escape = require('escape-html');
const sendmail = require('sendmail')();


module.exports.send = (name, emailFrom, message, callback) => {
  const emailTemplate = fs.readFileSync(path.join(__dirname, './contact-message-template.html'), 'utf8');
  const htmlMessage = emailTemplate.replace(
    '[[first]]', escape(name[0])
  ).replace(
    '[[last]]', escape(name[1])
  ).replace(
    '[[email]]', escape(emailFrom)
  ).replace(
    '[[message]]', escape(message)
  );
  const timestamp = `${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`;

  sendmail({
    from: 'contact@arkis.io',
    to: 'luke@deentaylor.com',
    subject: `Arkis contact form: ${name[0]} ${name[1]} (${emailFrom}) at ${timestamp}`,
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
