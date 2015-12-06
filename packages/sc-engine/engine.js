var logger = new Logger('engine');
Engine = {}

Engine.handleIncomingMessage = handleIncomingMessage;
Engine.sendScheduledMessages = sendScheduledMessages;

function handleIncomingMessage(phone, text) {
  var participant = Participants.findOne({ phone: phone });

  if (!participant || !participant.registered) {
    handleNewParticipant(phone, text);
    return;
  }

  handleStep(participant, text);

}

function handleNewParticipant(phone, text) {
  if (text === 'secretcode') {
    Participants.upsert({ phone: phone}, { $set: { phone: phone, registered: true, step: 0 }});
    Engine.send(phone, "Welcome");
    var p = Participants.findOne({ phone: phone });
    sendStepMessage(p, p.step);

  } else {
    Participants.upsert({ phone: phone}, {$set: { phone: phone, registered: false }});
    Engine.send(phone, 'That wasn\'t the secret code. You\'re not registered');
  }
}

function handleStep(participant, text) {
  var step = HuntSteps.findOne({ position: participant.step });

  if (text === 'skip' || step.answer == text) {
    Participants.update({ _id: participant._id }, {$set: { step: participant.step + 1 }});
    sendStepMessage(participant, participant.step + 1);
    return;
  }

  Engine.send(participant.phone, 'That\'s not the answer');

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

  Participants.find({ registered: true }).forEach(function(p) {
    Engine.send(p.phone, scheduledMessage.messageText);
  });

}
