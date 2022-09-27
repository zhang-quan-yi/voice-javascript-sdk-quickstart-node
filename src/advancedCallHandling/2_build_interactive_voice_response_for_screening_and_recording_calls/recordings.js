// POST: /recordings
// agentId: request.query.agentId
// from: request.body.From
// transcriptionText: request.body.TranslationText
// recordingUrl: request.body.RecordingUrl
const saveRecordings = function (
  agentId,
  from,
  transcriptionText,
  recordingUrl
) {
  // find agent by agentId;
  const agent = { recordings: [] };

  // save recordings
  agent.recordings.push({
    phoneNumber: from,
    transcription: transcriptionText,
    url: recordingUrl,
  });
};
