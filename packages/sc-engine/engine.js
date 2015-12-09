var logger = new Logger('engine');

Engine = {}

Engine.handleIncomingMessage = handleIncomingMessage;
Engine.sendScheduledMessages = sendScheduledMessages;

function findHunt() {
  return Hunts.findOne({ name: "Santa Cruise" });
}

// returns a message to respond with
function handleIncomingMessage(phone, text) {
  var hunt = findHunt();

  var participant = Participants.findOne({ phone: phone });
  var isNew = !participant;

  if (isNew) {
    Participants.insert({ phone: phone });
    return hunt.welcome;
  }

  if (FuzzyMatch.equals(hunt.unsubscribeCommand, text)) {
    Participants.update({ _id: participant._id }, { unsubscribed: true });
    return hunt.unsubscribeResponse;
  }

  if (participant.finished) {
    return hunt.finished;
  }

  if (_.isUndefined(participant.zone)) {
    var placed = placeInZone(participant, text);
    if (placed) {
      participant = Participants.findOne(participant._id);
      var zone = Zones.findOne({ position: participant.zone });
      var step = HuntSteps.findOne({ zoneId: zone._id, position: 0 });
      return step.hint;
    } else {
      return hunt.unavailableZone;
    }
  }



  var stepResponse = handleStep(participant, text);

  if (stepResponse === true) {
    return hunt.finished;
  } else if (_.isString(stepResponse)) {
    return stepResponse;
  } else {
    return hunt.incorrectAnswer;
  }
}

function handleStep(participant, text) {
  var zone = Zones.findOne({ position: participant.zone });
  var step = HuntSteps.findOne({ position: participant.step, zoneId: zone._id });

  if (FuzzyMatch.equals('skip', text) || _.any(step.answers, function(a) { return FuzzyMatch.equals(a, text); })) {

    if (FuzzyMatch.equals('skip', text)) {
      Participants.update(
        participant._id,
        {
          $push: {
            answeredSteps: step._id
          }
        }
      );
    } else {
      Participants.update(
        participant._id,
        {
          $push: {
            skippedSteps: step._id
          }
        }
      );
    }

    Participants.update(
      participant._id,
      {
        $push: {
          completedSteps: step._id
        }
      }
    );

    setNextStep(participant);

    var participant = Participants.findOne(participant._id);

    var zone = Zones.findOne({ position: participant.zone });

    var nextStep = HuntSteps.findOne({ zoneId: zone._id, position: participant.step });

    if (_.contains(participant.completedSteps, nextStep._id)) {
      Participants.update(participant._id, { $set: { finished: true } });
      return true;
    } else {
      return nextStep.hint;
    }
  }
}

function placeInZone(participant, text) {
  var zones = Zones.find({}).fetch();
  var zone = _.find(zones, function(zone) {
    return _.any(zone.entryCodes, function(code) {
      return FuzzyMatch.contains(text, code);
    });
  });

  if (zone) {
    Participants.update(participant._id, {
      $set: { zone: zone.position, step: 0 }
    });
    return true;
  } else {
    return false;
  }
}

function sendStepMessage(participant, stepNumber) {
  var step = HuntSteps.findOne({ position: stepNumber });
  if (step) {
    Engine.send(participant.phone, step.hint);
  } else {
    Engine.send(participant.phone, "all done!");
  }
}

function sendScheduledMessages(sendAt) {
  var scheduledMessage = ScheduledMessages.findOne({ sendAt: "7:00pm" });

  if (!scheduledMessage) { return; }

  Participants.find({ unsubscribed: { $not: { $eq: true } } }).forEach(function(p) {
    Engine.send(p.phone, scheduledMessage.messageText);
  });
}

function setNextStep(participant) {
  var zone = Zones.findOne({ position: participant.zone });
  var nextStep;
  var nextZone;

  // is there another step in this zone?
  if (nextStep = HuntSteps.findOne({ zoneId: zone._id, position: participant.step + 1 })) {
    Participants.update({ _id: participant._id }, { $inc: { step: 1 } });
  } else {

    // is there a next zone?
    if (nextZone = Zones.findOne({ position: zone.position + 1 })) {
      Participants.update({ _id: participant._id },
                          { $set: { zone: zone.position + 1, step: 0 } });
    } else { // loop around
      Participants.update({ _id: participant._id },
                          { $set: { zone: 0, step: 0 } });
    }
  }
}
