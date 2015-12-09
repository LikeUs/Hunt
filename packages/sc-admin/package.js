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
  api.use('babrahams:editable-text');
  api.use('babrahams:editable-list');
  api.use('reactive-var');

  api.use('sc-scheduled-messages');
  api.use('sc-hunt-steps');
  api.use('sc-participants');
  api.use('sc-zones');
  api.use('sc-hunts');
  api.use('sc-fuzzy-match');

  api.use('sc-engine', 'server');

  api.addFiles([
    'admin.html',
    'admin.js',
    'admin.css'
  ], 'client');

  api.addFiles([
    'server.js'
  ], 'server');
});
