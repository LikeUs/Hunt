var outbox;

Engine.send = function(phone, text) {
  outbox.push({ phone: phone, text: text });
}


function setupEngine() {
  outbox = [];
  Participants.remove({});
  HuntSteps.insert({
    position: 0,
    hint: "2 + 2",
    answer: "4"
  });
  HuntSteps.insert({
    position: 1,
    hint: "2 + 3",
    answer: "5"
  })
}




// describe Engine.handleMessage


// Registering

Tinytest.add('register successfully', function(test) {
  setupEngine();

  Engine.handleIncomingMessage('+11111111111', 'secretcode');

  var p = Participants.findOne({ phone: '+11111111111' });

  test.isTrue(p.registered, 'is registered');

  test.equal(outbox[0].phone, '+11111111111');
  test.equal(outbox[0].text, 'Welcome');
});


// Failing to Register

Tinytest.add('register unsuccessfully', function(test) {
  setupEngine();

  Engine.handleIncomingMessage("+11111111111", 'notsecretcode');

  var p = Participants.findOne({ phone: '+11111111111' });

  test.isFalse(p.registered, 'is not registered');

  test.equal(outbox[0].phone, '+11111111111');
  test.equal(outbox[0].text, 'That wasn\'t the secret code. You\'re not registered');
});


function addParticipant(phone) {
  Participants.insert({ phone: phone, registered: true, step: 0 });
}

// Skipping step 1
Tinytest.add('skipping step 1', function(test) {
  setupEngine();
  addParticipant('8315317345');

  Engine.handleIncomingMessage('8315317345', 'skip');

  var p = Participants.findOne({ phone: '8315317345' });

  test.equal(p.step, 1);
  test.equal(outbox[0].phone, p.phone);
  test.equal(outbox[0].text, "2 + 3");

});


// Passing step 1

Tinytest.add('passing step 1', function(test) {
  setupEngine();
  addParticipant('8315317345');

  Engine.handleIncomingMessage('8315317345', '4');

  var p = Participants.findOne({ phone: '8315317345' });

  test.equal(p.step, 1);
  test.equal(outbox[0].phone, p.phone);
  test.equal(outbox[0].text, "2 + 3");

});


// Failing step 1
Tinytest.add('failing step 1', function(test) {
  setupEngine();
  addParticipant('8315317345');

  Engine.handleIncomingMessage('8315317345', '343');

  var p = Participants.findOne({ phone: '8315317345' });

  test.equal(p.step, 0);
  test.equal(outbox[0].phone, p.phone);
  test.equal(outbox[0].text, "That's not the answer");

});



// Sending scheduled events

Tinytest.add('sending a 7:00 message', function(test) {
  setupEngine();
  addParticipant('8315317345');
  addParticipant('8314207936');

  ScheduledMessages.insert({ sendAt: '7:00pm', messageText: "Ding dong, 7pm" });

  Engine.sendScheduledMessages('7:00pm');

  var phones = _.pluck(outbox, 'phone');

  test.include(phones, '8315317345');
  test.include(phones, '8314207936');
  test.equal(outbox[0].text, "Ding dong, 7pm");
  test.equal(outbox[1].text, "Ding dong, 7pm");

});
