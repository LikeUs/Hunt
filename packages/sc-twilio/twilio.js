var logger = new Logger('twilio');


var bodyParser = Npm.require( 'body-parser');

Picker.middleware(bodyParser.urlencoded({ extended: false }));

Picker.route('/twilio/incoming', function(params, req, res, next) {
  var message = req.body;

  logger.warn('incoming message: ' + JSON.stringify(message));

  var responseMessage = Engine.handleIncomingMessage(message.From, message.Body);
  res.writeHead(200);
  res.setHeader('content-type', 'text/xml');
  res.end(
    '<?xml version="1.0" encoding="UTF-8"?>' +
      '<Response>' +
      '<Message>' + responseMessage + '</Message>' +
      '</Response>'
  );
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
