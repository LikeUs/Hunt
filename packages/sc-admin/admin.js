
FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('Admin');
  }
});

Template.Admin.onRendered(function() {
  $('.menu .item').tab();
});

Template.Settings.helpers({
  hunt: function() {
    return Hunts.findOne({ name: 'Santa Cruise' });
  },

  fields: [
    {
      label: "Welcome Message",
      field: "welcome",
    },
    {
      label: "Finished Message",
      field: "finished"
    },
    {
      label: "Unsubscribe Command",
      field: "unsubscribeCommand"
    },
    {
      label: "Unsubscribe Response",
      field: "unsubscribeResponse"
    }
  ]
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

  steps: function(zoneId) {
    return HuntSteps.find({ zoneId: zoneId }, { sort: { position: 1 } });
  },

  zones: function() {
    return Zones.find({});
  }

});

Template.HuntSteps.events({

  'click [rel=add-zone]': function() {
    Zones.insert({});
  },


  'click [rel=add]': function() {
    HuntSteps.insert({ zoneId: this._id, position: HuntSteps.find({ zoneId: this._id }).count() });
  },

  'click [rel=remove]': function() {
    HuntSteps.remove(this._id);
    HuntSteps.resetPositions(this.zoneId);
  },

  'click [rel=move-up]': function() {
    HuntSteps.moveUp(this.zoneId, this._id);
  },

  'click [rel=move-down]': function() {
    HuntSteps.moveDown(this.zoneId, this._id);
  }

});

Template.Participants.helpers({
  participants: function() {
    return Participants.find({});
  }
});

Template.Participants.events({
  'click [rel=reset-step]': function() {
    Participants.update(this._id, { $set: { step: 0 } });
  },

  'click [rel=remove]': function() {
    Participants.remove(this._id);
  }
});
