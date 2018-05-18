import * as fs from "fs-extra";
import * as path from "path";
import WordMap from "../index";

describe("MAP", () => {

  it("translates verbosely from corpus", () => {
    const map = new WordMap();

    // append corpus
    const sourceCorpus = fs.readFileSync(path.join(
      __dirname,
      "fixtures/small_corpus/greek.txt"
    ));
    const targetCorpus = fs.readFileSync(path.join(
      __dirname,
      "fixtures/small_corpus/english.txt"
    ));
    map.appendCorpusString(
      sourceCorpus.toString("utf-8"),
      targetCorpus.toString("utf-8")
    );

    const sourceSentence = "Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ.";
    // actual translation "The book of the genealogy of Jesus Christ, son of David, son of Abraham:"
    const translation = map.translateVerbose(sourceSentence, 10);
    Object.keys(translation).map((key) => {
      console.log(key);
      console.log(translation[key].map((p) => p.toString()));
    });
  });

  it("translates from corpus", () => {
    const map = new WordMap();

    // append corpus
    const sourceCorpus = fs.readFileSync(path.join(
      __dirname,
      "fixtures/small_corpus/greek.txt"
    ));
    const targetCorpus = fs.readFileSync(path.join(
      __dirname,
      "fixtures/small_corpus/english.txt"
    ));
    map.appendCorpusString(
      sourceCorpus.toString("utf-8"),
      targetCorpus.toString("utf-8")
    );

    const sourceSentence = "Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ.";
    // actual translation "The book of the genealogy of Jesus Christ, son of David, son of Abraham:"
    const translation = map.translate(sourceSentence, 10);
    console.log("corpus\n", translation.map((s) => {
      return s.toString();
    }));
  });

});
