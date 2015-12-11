Package.describe({
  name: 'sc-schedule',
  version: '0.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript', 'server');
  api.use('jag:pince');
  api.use('percolate:synced-cron');
  api.use('momentjs:moment');
  api.use('sc-engine');
  api.use('sc-scheduled-messages');

  api.addFiles('schedule.js', 'server');

  api.export('Schedule', 'server');

});

Package.onTest(function(api) {
});
