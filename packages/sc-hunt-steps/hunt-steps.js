
HuntSteps = new Mongo.Collection('hunt-steps');

function resetPositions(zoneId) {
  HuntSteps.find({ zoneId: zoneId }, { sort: { position: 1 } }).forEach(function(doc, index) {
    HuntSteps.update(doc._id, { $set: { position: index } });
  });
}

function moveStep(zoneId, id, direction) {
  var step = HuntSteps.findOne(id);

  var pos = step.position + direction;

  var otherStep = HuntSteps.findOne({ position: pos, zoneId: zoneId });

  if (!otherStep) { return; }

  HuntSteps.update(step._id, { $set: { position: pos } });
  HuntSteps.update(otherStep._id, { $set: { position: step.position } });
}

HuntSteps.moveUp = function(zoneId, id) {
  moveStep(zoneId, id, -1);
}

HuntSteps.moveDown = function(zoneId, id) {
  moveStep(zoneId, id, 1);
}

HuntSteps.resetPositions = resetPositions;
