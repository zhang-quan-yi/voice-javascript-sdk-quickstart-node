const twilio = require("twilio");
const VoiceResponse = twilio.twiml.VoiceResponse;

// Post /menu
// digits: request.body.Digits
exports.menu = function (digits) {
  const optionActions = {
    1: returnInstructions,
    2: planets,
  };

  const action = optionActions[digits] || redirectWelcome;
  return action().toString();
};

function returnInstructions() {
  const twiml = new VoiceResponse();
  twiml.say(
    { voice: "alice", language: "en-GB" },
    `
    To get to your extraction point, 
      get on your bike and go down the street.
      Then Left down an alley. Avoid the police cars.
      Turn left into an unfinished housing development.
      Fly over the roadblock.
      Go passed the moon. 
    Soon after you will see your mother ship.
  `
  );
  twiml.say(`
    Thank you for calling the Ray Phone Home Service - the adventurous 
    alien's first choice in intergalactic travel.
  `);
  twiml.hangup();

  return twiml;
}

function planets() {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: "/extension/connect",
    numDigits: "1",
  });
  gather.say(
    { voice: "alice", language: "en-GB", loop: "3" },
    `
    To call the planet Broh doe As O G, press 2.
    To call the planet DuhGo bah, press 3.
    To call an oober asteroid to your location, press 4.
    To go back to the main menu, press the star key.
  `
  );

  return twiml;
}

function redirectWelcome() {
  const twiml = new VoiceResponse();
  twiml.redirect("/ivr/welcome");

  return twiml;
}
