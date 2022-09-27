const twilio = require("twilio");
const VoiceResponse = twilio.twiml.VoiceResponse;

// POST: /extension/connect
// digits: request.body.Digits
exports.extensionConnect = async function (digits) {
  const extensions = {
    2: "Brodo",
    3: "Dagobah",
    4: "Oober",
  };
  const agent = await findAgent(extensions[digits]);
  if (agent === null) {
    return redirectToWelcome();
  }
  const twiml = new VoiceResponse();
  twiml.say(
    { voice: "alice", language: "en-GB" },
    "You'll be connected shortly to your planet."
  );
  // Twilio will make a GET or POST request
  // to the action URL (if provided) when the <Dial> call ends.
  const dial = twiml.dial({
    action: `/agents/call?agentId=${agent.id}`,
    callerId: agent.phoneNumber,
  });
  dial.number({ url: "/agents/screencall" }, agent.phoneNumber);
  return twiml.toString();
};

function redirectToWelcome() {
  const twiml = new VoiceResponse();
  twiml.redirect("/ivr/welcome");

  return twiml.toString();
}

function findAgent(extension) {
  const agents = [
    { extension: "Brodo", phoneNumber: "+15552483591" },
    { extension: "Dagobah", phoneNumber: "+15558675309" },
    { extension: "Oober", phoneNumber: "+15553185602" },
  ];
  const agent = agents.find((item) => item.extension === extension);
  return Promise.resolve(agent);
}
