Package.describe({
  name: 'sc-admin',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('templating');
  api.use('kadira:flow-router');
  api.use('kadira:blaze-layout');

  api.addFiles([
    'admin.html',
    'admin.js'
  ], 'client');
});
