Package.describe({
  name: 'sc-engine',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('jag:pince');
  api.use('underscore');

  api.use('sc-fuzzy-match');
  api.use('sc-participants');
  api.use('sc-hunt-steps');
  api.use('sc-scheduled-messages');
  api.use('sc-hunts');
  api.use('sc-zones');

  api.addFiles([
    'engine.js'
  ], 'server');

  api.export('Engine', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('underscore');

  api.use('sc-engine');
  api.use('sc-participants');
  api.use('sc-hunt-steps');
  api.use('sc-scheduled-messages');
  api.use('sc-hunts');
  api.use('sc-zones');

  api.addFiles([
    'engine-tests.js'
  ], 'server');
});
