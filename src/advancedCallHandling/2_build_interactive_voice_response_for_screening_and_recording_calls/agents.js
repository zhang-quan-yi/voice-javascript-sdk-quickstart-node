const twilio = require("twilio");
const VoiceResponse = twilio.twiml.VoiceResponse;

// Get /agents
exports.getAgents = function () {
  // render agents index view.
  return [];
};

// Post /agents/call
// callStatus: request.body.CallStatus
// agentId: req.query.agentId
exports.call = function (callStatus, agentId) {
  if (callStatus === "completed") {
    return "";
  }
  const twiml = new VoiceResponse();
  twiml.say(
    { voice: "alice", language: "en-GB" },
    `
      It appears that no agent is available.
      Please leave a message after the beep.
    `
  );
  twiml.record({
    maxLength: 20,
    action: "/agents/hangup",
    transcribeCallback: "/recordings?agentId=" + agentId,
  });
  twiml.say(
    { voice: "alice", language: "en-GB" },
    "No record received. Goodbye"
  );
  twiml.hangup();
  return twiml.toString();
};

// Post /agents/hangup
exports.hangup = function () {
  const twiml = new VoiceResponse();
  twiml.say(
    { voice: "alice", language: "en-GB" },
    "Thanks for your message. Goodbye"
  );
  twiml.hangup();
  return twiml.toString();
};

// Post /agents/screencall
// from: request.body.From
exports.screenCall = function (from) {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: "/agents/connectmessage",
    numDigits: "1",
  });
  gather.say(spellPhoneNumber(from));
  gather.say("Press any key to accept");

  twiml.say("Sorry. Did not get your response");
  twiml.hangup();

  return twiml.toString();
};

// Post /agents/connectmessage
exports.connectMessage = function () {
  const twiml = new VoiceResponse();
  twiml.say("Connecting you to the extraterrestrial in distress.");
  return twiml.toString();
};

function spellPhoneNumber(phoneNumber) {
  return phoneNumber.split("").join(",");
}
