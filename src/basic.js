const config = require("../config");
const twilio = require("twilio");
const client = twilio(config.accountSid, config.authToken);
const VoiceResponse = twilio.twiml.VoiceResponse;

// 01 make outbound phone call
exports.makeOutboundCall = function () {
  client.calls.create({
    twiml: `
      <Response>
        <Say>
          Ahoy, Ray!
        </Say>
      </Response>
    `,
    from: "+19378064443",
    to: "+19378064443",
  });
};

// 02 respond to incoming phone calls
exports.respondIncomingCall = function () {
  const twiml = new VoiceResponse();
  twiml.say({ voice: "alice" }, "Hello ray boy!");
  return twiml.toString();
};

// 03 modify calls in progress.
exports.modifyCallsInProgress = function (callSID, URL) {
  if (true) {
    // update with twiml instructions
    client
      .calls(callSID)
      .update({
        twiml: `
          <Response>
            <Say>
              Ahoy, Ray Again!
            </Say>
          </Response>
        `,
      })
      .then(function (call) {
        console.log("Call", call);
      });
    return;
  }
  if (true) {
    // update with new url
    client
      .calls(callSID)
      .update({
        method: "POST",
        url: URL,
      })
      .then(function (call) {
        console.log("Call", call);
      });
    return;
  }
  if (true) {
    // Terminate a call
    client
      .calls(callSID)
      .update({
        status: "completed",
      })
      .then(function (call) {
        console.log("Call", call);
      });
    return;
  }
};

// 04 record phone calls
exports.recordPhoneCall = function () {
  if (false) {
    // record part of an incoming call
    const twiml = new VoiceResponse();
    twiml.say("Hello Ray. Please leave a message after the beep.");
    twiml.record();
    twiml.hangup();
    return twiml.toString();
  }
  if (false) {
    // record and transcribe an incoming call
    const twiml = new VoiceResponse();
    twiml.say("Hello Ray. Please leave a message after the beep.");
    twiml.record({ transcribe: true, maxLength: 30 });
    twiml.hangup();
    return twiml.toString();
  }
  if (false) {
    // record an entire outgoing call
    client.calls
      .create({
        record: true,
        transcribe: true,
        twiml: `
          <Response>
            <Say>
              Hello Ray. Please leave a message after the beep.
            </Say>
          </Response>
        `,
        to: "+14155551212",
        from: "+15017122661",
      })
      .then((call) => console.log(call.sid));
    return false;
  }
};

// 05 create conference call
// For incoming call
// from: request.body.From
exports.createConferenceCall = function (from) {
  // Dynamic conference calls
  const twiml = new VoiceResponse();
  const dial = twiml.dial();
  const MODERATOR = "+1...";
  if (from === MODERATOR) {
    dial.conference("My conference", {
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
    });
  } else {
    dial.conference("My conference", {
      startConferenceOnEnter: false,
    });
  }
  return twiml.toString();
};

// 06 gather user input via keypad.
// For incoming call
// digits: request.body.Digits
exports.gatherUserInput = function (digits, redirectURL) {
  const twiml = new VoiceResponse();
  const gatherInstruction = function () {
    const gather = twiml.gather({ numDigits: 1 });
    gather.say("For sales, press 1. For support, press 2.");
    twiml.redirect(redirectURL);
  };

  if (digits) {
    switch (digits) {
      case "1":
        twiml.say("You selected sales. Good for you!");
        break;
      case "2":
        twiml.say("You need support. We will help!");
        break;
      default:
        twiml.say("Sorry, I don't understand that choice.");
        twiml.pause();
        gatherInstruction();
        break;
    }
  } else {
    gatherInstruction();
  }

  return twiml.toString();
};

// 06.5 gather user input via keypad with action.
// For incoming call
exports.gatherUserInput_main = function () {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({ numDigits: 1, action: "/gather" });
  gather.say("For sales, press 1. For support, press 2.");
  twiml.redirect("/main");
  return twiml.toString();
};
// digits: request.body.Digits
exports.gatherUserInput_gather = function (digits) {
  const twiml = new VoiceResponse();
  if (digits) {
    switch (digits) {
      case "1":
        twiml.say("You selected sales. Good for you!");
        break;
      case "2":
        twiml.say("You need support. We will help!");
        break;
      default:
        twiml.say("Sorry, I don't understand that choice.");
        twiml.pause();
        twiml.redirect("/main");
        break;
    }
  } else {
    twiml.redirect("/main");
  }
  return twiml.toString();
};
