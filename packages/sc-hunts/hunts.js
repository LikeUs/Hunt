Hunts = new Mongo.Collection('hunts');

if (Meteor.isServer) {
  Meteor.startup(function() {
    var hunt = Hunts.findOne({ name: 'Santa Cruise' });

    if (!hunt) {
      Hunts.insert({ name: 'Santa Cruise' });
    }
  });
}
