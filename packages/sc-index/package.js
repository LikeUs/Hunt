Package.describe({
  name: 'sc-index',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('templating');
  api.use('sc-admin');
  api.use('sc-twilio');
  api.use('sc-schedule', 'server');
  api.addFiles('index.html');

  api.addFiles('server.js', 'server');
});

Package.onTest(function(api) {
});
