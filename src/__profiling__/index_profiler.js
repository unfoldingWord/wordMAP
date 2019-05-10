const fs = require("fs-extra");
const path = require("path");
const WordMap = require("../../dist/WordMap").default;

/**
 * This is used for running V8 CPU Memory and CPU profiling without jest overhead.
 * Before running the profile on this script make sure you have built
 * the project so the imports above work.
 */
function profilerStub() {
  // load corpus
  const sourceCorpus = fs.readFileSync(path.join(
    __dirname,
    "../__tests__/fixtures/corpus/greek.txt"
  )).toString("utf-8");
  const targetCorpus = fs.readFileSync(path.join(
    __dirname,
    "../__tests__/fixtures/corpus/english.txt"
  )).toString("utf-8");

  // index corpus
  const map = new WordMap();
  map.appendCorpusString(
    sourceCorpus,
    targetCorpus
  );
}

// run so we can profile it
profilerStub();
