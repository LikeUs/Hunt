
var bodyParser = Npm.require( 'body-parser');

Picker.middleware(bodyParser.urlencoded());

Picker.route('/twilio/incoming', function(params, req, res, next) {
  var message = req.body;

  Engine.handleIncomingMessage(req.From, req.Body);

  res.writeHead(200);
  res.end('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
});



var client = new Twilio({
  from: Meteor.settings.twilio.from,
  sid: Meteor.settings.twilio.sid,
  token: Meteor.settings.twilio.token
});


Engine.send = function(phone, text) {
  client.sendSMS({
    to: phone,
    body: text
  });
};
