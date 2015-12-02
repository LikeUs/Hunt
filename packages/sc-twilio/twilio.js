var logger = new Logger('twilio');


var bodyParser = Npm.require( 'body-parser');

Picker.middleware(bodyParser.urlencoded({ extended: false }));

Picker.route('/twilio/incoming', function(params, req, res, next) {
  var message = req.body;

  Engine.handleIncomingMessage(req.From, req.Body);

  logger.warn('incoming message: ' + JSON.stringify(message));

  res.writeHead(200);
  res.end('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
});



var client = new Twilio({
  from: Meteor.settings.twilio.from,
  sid: Meteor.settings.twilio.sid,
  token: Meteor.settings.twilio.token
});


Engine.send = function(phone, text) {
  logger.warn('outgoing message: ' + JSON.stringify({ phone: phone, text: text }));
  client.sendSMS({
    to: phone,
    body: text
  });
};
