const fs = require("fs-extra");
const path = require("path");
const WordMap = require("../../dist/WordMap").default;

/**
 * This is used for running V8 CPU Memory and CPU profiling.
 * Before running the profile on this script make sure you have built
 * the project so the imports above work.
 */
function profilerStub() {
  // load corpus
  const sourceCorpus = fs.readFileSync(path.join(
    __dirname,
    "fixtures/corpus/greek.txt"
  )).toString("utf-8");
  const targetCorpus = fs.readFileSync(path.join(
    __dirname,
    "fixtures/corpus/english.txt"
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

it('lets this file pass as a test', () => {

});
