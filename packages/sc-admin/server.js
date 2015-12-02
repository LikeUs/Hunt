
Meteor.methods({

  runTestScheduledMessage: function(id) {
    Engine.sendScheduledMessages(ScheduledMessages.findOne(id).sendAt);
  }

});
