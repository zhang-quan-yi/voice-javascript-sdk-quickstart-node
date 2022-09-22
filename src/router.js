const Router = require("express").Router;
const { tokenGenerator, voiceResponse, makeCall } = require("./handler");

const router = new Router();

router.get("/token", (req, res) => {
  res.send(tokenGenerator());
});

router.post("/voice", (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(voiceResponse(req.body));
});

router.get("/call", async (req, res) => {
  const sid = await makeCall(req.query);
  res.send(`call sid: ${sid}`);
});

module.exports = router;
