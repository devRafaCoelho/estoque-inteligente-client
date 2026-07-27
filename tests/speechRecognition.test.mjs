import assert from "node:assert/strict";
import { appendSpeechTranscript } from "../src/utils/speech/speechRecognition.js";

assert.equal(appendSpeechTranscript("", "2kg arroz"), "2kg arroz");
assert.equal(appendSpeechTranscript("2kg arroz", "1 leite"), "2kg arroz 1 leite");
assert.equal(appendSpeechTranscript("2kg arroz,", "1 leite"), "2kg arroz,1 leite");
assert.equal(appendSpeechTranscript("  ", "  leite  "), "leite");

console.log("speechRecognition.test.mjs: ok");
