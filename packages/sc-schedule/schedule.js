var logger = new Logger('schedule');

SyncedCron.add({
  name: 'Send scheduled messages',
  schedule: function(parser) {
    return parser.text('every 1 minute');
  },
  job: function(intendedAt) {
    var ss = ScheduledMessages.find({ sent: { $ne: true } });

    ss.forEach(function(sm) {
      var sendAt = moment(sm.sendAt + "+800", "h:maZ");

      if (moment(sendAt).isBefore(moment(intendedAt))) {
        logger.warn('sending', sm);
        ScheduledMessages.update(sm._id, { $set: { sent: true } });
        Engine.sendScheduledMessages(sm.sendAt);
      }
    });
  }
});


Schedule = {
  start: function() { SyncedCron.start(); }
}
