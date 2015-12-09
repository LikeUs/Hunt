var outbox;

Engine.send = function(phone, text) {
  outbox.push({ phone: phone, text: text });
}


function setupEngine() {
  outbox = [];
  Participants.remove({});
  Zones.remove({});
  HuntSteps.remove({});
  Hunts.remove({});

  var z1 = Zones.insert({
    name: "Z A",
    position: 0,
    entryCodes: ["Red", "Blue"]
  });

  var z2 = Zones.insert({
    name: "Z B",
    position: 1,
    entryCodes: ["Orange", "Yellow"]
  });


  HuntSteps.insert({
    position: 0,
    hint: "2 + 2",
    answers: ["4", "four"],
    zoneId: z1,
  });

  HuntSteps.insert({
    position: 1,
    hint: "2 + 3",
    answers: ["5"],
    zoneId: z1
  });

  HuntSteps.insert({
    position: 0,
    hint: "2 + 4",
    answers: ["6"],
    zoneId: z2,
  });

  HuntSteps.insert({
    position: 1,
    hint: "2 + 5",
    answers: ["7"],
    zoneId: z2
  })

  Hunts.insert({
    name: "Santa Cruise",
    welcome: "Welcome",
    finished: "All done",
    unsubscribeCommand: "unsubscribeme",
    unsubscribeResponse: "you're unsubscribed",
    incorrectAnswer: "That's not correct",
    unavailableZone: "That's not a place"
  });
}


// describe Engine.handleMessage


// Registering

Tinytest.add('register successfully', function(test) {

  _.each([
    { code: "red", zone: 0, hint: "2 + 2" },
    { code: "Blue", zone: 0, hint: "2 + 2" },
    { code: "the OranGe", zone: 1, hint: "2 + 4" },
    { code: "YELLOW", zone: 1, hint: "2 + 4" }
  ], function(ex) {
    setupEngine();

    var res = Engine.handleIncomingMessage('+11111111111', 'hi');

    var p = Participants.findOne({ phone: '+11111111111' });

    test.equal(res, 'Welcome');
    test.isNotUndefined(p);

    res = Engine.handleIncomingMessage('+11111111111', ex.code);

    p = Participants.findOne({ phone: '+11111111111' });

    test.equal(p.zone, ex.zone);
    test.equal(res, ex.hint);
    test.equal(p.step, 0);
  });
});

Tinytest.add('register unsuccessfully', function(test) {
  setupEngine();

  var res = Engine.handleIncomingMessage('+11111111111', 'hi');

  var p = Participants.findOne({ phone: '+11111111111' });

  test.equal(res, 'Welcome');
  test.isNotUndefined(p);

  res = Engine.handleIncomingMessage('+11111111111', "floobity");

  p = Participants.findOne({ phone: '+11111111111' });

  test.isUndefined(p.zone);
  test.equal(res, "That's not a place");
  test.isUndefined(p.step);
});


function addParticipant(phone) {
  Participants.insert({ phone: phone, zone: 0, step: 0 });
}

// Skipping step 1
Tinytest.add('skipping step 1', function(test) {
  setupEngine();
  addParticipant('8315317345');

  var res = Engine.handleIncomingMessage('8315317345', 'skip');

  var p = Participants.findOne({ phone: '8315317345' });

  test.equal(p.step, 1);
  test.equal(p.zone, 0);
  test.equal(res, "2 + 3");
});


// Passing step 1

Tinytest.add('passing step 1', function(test) {
  _.each(["four", "4", "Four", "four   "], function(answer) {
    setupEngine();
    addParticipant('8315317345');

    var res = Engine.handleIncomingMessage('8315317345', answer);

    var p = Participants.findOne({ phone: '8315317345' });

    test.equal(p.step, 1);
    test.equal(p.zone, 0);
    test.equal(res, "2 + 3");
  });
});


// Failing step 1
Tinytest.add('failing step 1', function(test) {
  setupEngine();
  addParticipant('8315317345');

  var res = Engine.handleIncomingMessage('8315317345', '343');

  var p = Participants.findOne({ phone: '8315317345' });

  test.equal(p.step, 0);
  test.equal(p.zone, 0);
  test.equal(res, "That's not correct");
});

Tinytest.add('moving from Z A to Z B', function(test) {
  setupEngine();
  addParticipant('8315317345');
  Participants.update({ phone: '8315317345' },
                      { $set: { zone: 0, step: 1 } });

  var res = Engine.handleIncomingMessage('8315317345', '5');

  var p = Participants.findOne({ phone: '8315317345' });

  test.equal(p.step, 0);
  test.equal(p.zone, 1);
  test.equal(res, '2 + 4');
});

Tinytest.add('moving from Z B to Z A', function(test) {
  setupEngine();
  addParticipant('8315317345');
  Participants.update({ phone: '8315317345' },
                      { $set: { zone: 1, step: 1 } });

  var res = Engine.handleIncomingMessage('8315317345', '7');

  var p = Participants.findOne({ phone: '8315317345' });

  test.equal(p.step, 0);
  test.equal(p.zone, 0);
  test.equal(res, '2 + 2');
});

Tinytest.add('whole hunt', function(test) {
  setupEngine();
  addParticipant('8315317345');
  Participants.update({ phone: '8315317345' },
                      { $set: { zone: 0, step: 0 } });


  Engine.handleIncomingMessage('8315317345', '4');
  Engine.handleIncomingMessage('8315317345', '5');
  Engine.handleIncomingMessage('8315317345', '6');
  var res = Engine.handleIncomingMessage('8315317345', '7');

  var p = Participants.findOne({ phone: '8315317345' });

  test.equal(res, 'All done');
  test.equal(p.finished, true);
});


// Sending scheduled events

Tinytest.add('sending a 7:00 message', function(test) {
  setupEngine();
  addParticipant('8315317345');
  addParticipant('8314207936');

  Participants.update({ phone: '8314207936' }, { $set: { unsubscribed: true } });

  ScheduledMessages.insert({ sendAt: '7:00pm', messageText: "Ding dong, 7pm" });

  Engine.sendScheduledMessages('7:00pm');

  var phones = _.pluck(outbox, 'phone');

  test.include(phones, '8315317345');
  test.notInclude(phones, '8314207936');
  test.equal(outbox[0].text, "Ding dong, 7pm");

});
