Package.describe({
  name: 'sc-index',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('templating');
  api.use('sc-admin');
  api.addFiles('index.html');
});

Package.onTest(function(api) {
});
