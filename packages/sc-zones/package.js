Package.describe({
  name: 'sc-zones',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('mongo');

  api.addFiles([
    'zones.js',
  ]);

  api.export('Zones');

});
