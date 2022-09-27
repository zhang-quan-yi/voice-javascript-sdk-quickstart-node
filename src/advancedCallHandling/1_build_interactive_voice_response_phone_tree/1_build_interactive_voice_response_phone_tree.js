const VoiceResponse = require("twilio").twiml.VoiceResponse;

// ivr/main
exports.main = function () {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    action: "/ivr/menu",
    numDigits: "1",
    method: "POST",
  });

  gather.say(
    `
    Thanks for calling the Ray Phone Home Service. 
    Please press 1 for directions.
    Press 2 for a list of planets to call. 
  `,
    { loop: 3 }
  );

  return twiml.toString();
};

// ivr/menu
exports.menu = function (digit) {
  const optionActions = {
    1: giveExtractionPointInstructions,
    2: listPlanets,
  };
  return optionActions[digit] ? optionActions[digit]() : redirectMain();
};

// ivr/planets
exports.planets = function (digit) {
  const optionActions = {
    2: "+12.....",
    3: "+13.....",
    4: "+14.....",
  };
  if (optionActions[digit]) {
    const twiml = new VoiceResponse();
    twiml.dial(optionActions[digit]);
    return twiml.toString();
  }
  return redirectMain();
};

function giveExtractionPointInstructions() {
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
  return twiml.toString();
}

function listPlanets() {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: "/ivr/planets",
    numDigits: 1,
    method: "POST",
  });
  gather.say(
    `
    To call the planet Broh doe As O G, press 2.
    To call the planet DuhGo bah, press 3.
    To call an oober asteroid to your location, press 4.
    To go back to the main menu, press the star key.
  `,
    { voice: "alice", language: "en-GB", loop: 3 }
  );
  return twiml.toString();
}

function redirectMain() {
  const twiml = new VoiceResponse();

  twiml.say(`Returning to the main menu.`, {
    voice: "alice",
    language: "en-GB",
  });
  twiml.redirect("/ivr/main");

  return twiml.toString();
}
