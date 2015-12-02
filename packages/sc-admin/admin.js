
FlowRouter.route('/', {
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
  },

  'click [rel=send-test]': function() {
    Meteor.call('runTestScheduledMessage', this._id);
  }

});

Template.HuntSteps.helpers({

  steps: function() {
    return HuntSteps.find({}, { sort: { position: 1 } });
  }

});

Template.HuntSteps.events({
  'click [rel=add]': function() {
    HuntSteps.insert({ position: HuntSteps.find({}).count() });
  },

  'click [rel=remove]': function() {
    HuntSteps.remove(this._id);
    HuntSteps.resetPositions();
  },

  'click [rel=move-up]': function() {
    HuntSteps.moveUp(this._id);
  },

  'click [rel=move-down]': function() {
    HuntSteps.moveDown(this._id);
  }

});

Template.Participants.helpers({
  participants: function() {
    return Participants.find({});
  }
});

Template.Participants.events({
  'click [rel=reset-step]': function() {
  }
});
