const twilio = require("twilio");
const VoiceResponse = twilio.twiml.VoiceResponse;

// Post /ivr/welcome
exports.welcome = function () {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: "/menu",
    numDigits: "1",
  });
  gather.say(
    { loop: 3 },
    `
    Thanks for calling the Ray Phone Home Service. 
      Please press 1 for directions.
      Press 2 for a list of planets to call. 
  `
  );
  return twiml.toString();
};
