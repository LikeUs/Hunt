
FlowRouter.route('/admin', {
  action: function() {
    BlazeLayout.render('Admin');
  }
});

Template.ScheduledMessages.helpers({

  messages: function() {
    return ScheduledMessages.find({});
  }

});

Template.ScheduledMessages.events({

  'click [rel=add]': function() {
    ScheduledMessages.insert({});
  },

  'click [rel=remove]': function() {
    ScheduledMessages.remove(this._id);
  }

});
