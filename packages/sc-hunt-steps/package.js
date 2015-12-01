Package.describe({
  name: 'sc-hunt-steps',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('mongo');

  api.addFiles([
    'hunt-steps.js',
  ]);

  api.export('HuntSteps');

});
