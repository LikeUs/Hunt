Package.describe({
  name: 'sc-twilio',
  version: '0.0.1'
});

Npm.depends({
  'body-parser': '1.14.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript', 'server');
  api.use('meteorhacks:picker', 'server');
  api.use('dispatch:twilio', 'server');
  api.use('jag:pince');

  api.use('sc-engine');

  api.addFiles('twilio.js', 'server');

});

Package.onTest(function(api) {
});
