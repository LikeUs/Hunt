
Meteor.methods({

  runTestScheduledMessage: function(id) {
    Engine.sendScheduledMessages(ScheduledMessage.findOne(id).sendAt);
  }

});
