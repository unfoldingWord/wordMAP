import * as fs from "fs-extra";
import * as path from "path";
import MAP from "../index";

describe("MAP", () => {
  it("has no corpus", () => {
    const map = new MAP();
    const suggestions = map.predict("hello", "olleh dlrow");
    expect(suggestions.length).toEqual(1);

    const s1 = suggestions[0];
    expect(s1.getPredictions().length).toEqual(1);
    expect(s1.getPredictions()[0].alignment.key).toEqual("n:hello->n:olleh:dlrow");
  });

  // it("has some corpus", () => {
  //   const map = new MAP();
  //   map.appendCorpusString("once hello what", "ecno olleh dlrow tahw");
  //   map.appendCorpusString("once hello what", "ecno olleh dlrow tahw");
  //   map.appendCorpusString("once hello what", "ecno olleh dlrow tahw");
  //   map.appendCorpusString("once hello what", "ecno olleh dlrow tahw");
  //   const suggestions = map.predict("hello world", "olleh dlrow nhoj");
  //   expect(suggestions.length).toEqual(1);
  //
  //   const s1 = suggestions[0];
  //   expect(s1.getPredictions().length).toEqual(2);
  //   expect(s1.getPredictions()[0].alignment.key).toEqual("n:hello->n:olleh:dlrow");
  //   expect(s1.getPredictions()[1].alignment.key).toEqual(
  //     "n:world->n:nhoj");
  // });

  it("predicts from saved alignments", () => {
    const map = new MAP();
    // append saved alignments
    const sourceSavedAlignments = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/greek.txt"
    ));
    const targetSavedAlignments = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/english.txt"
    ));
    map.appendSavedAlignmentsString(
      sourceSavedAlignments.toString("utf-8"),
      targetSavedAlignments.toString("utf-8")
    );

    const unalignedPair = [
      "Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ.",
      "The book of the genealogy of Jesus Christ, son of David, son of Abraham:"
    ];
    const suggestions = map.predict(unalignedPair[0], unalignedPair[1], 5);

    const stuff = [
      suggestions[0].toString(),
      suggestions[1].toString(),
      suggestions[2].toString(),
      suggestions[3].toString(),
      suggestions[4].toString()
    ];

    console.log("saved alignments\n", stuff);
  });

  it("predicts from corpus", () => {
    const map = new MAP();

    // append corpus
    const sourceCorpus = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corpus/greek.txt"
    ));
    const targetCorpus = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corpus/english.txt"
    ));
    map.appendCorpusString(
      sourceCorpus.toString("utf-8"),
      targetCorpus.toString("utf-8")
    );

    const unalignedPair = [
      "Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ.",
      "The book of the genealogy of Jesus Christ, son of David, son of Abraham:"
    ];
    const suggestions = map.predict(unalignedPair[0], unalignedPair[1], 5);

    const stuff = [
      suggestions[0].toString(),
      suggestions[1].toString(),
      suggestions[2].toString(),
      suggestions[3].toString(),
      suggestions[4].toString()
    ];

    // noinspection TsLint
    console.log("corpus\n", stuff);
  });

  it("predicts from corpus and saved alignments", () => {
    const map = new MAP();

    // append corpus
    const sourceCorpus = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corpus/greek.txt"
    ));
    const targetCorpus = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corpus/english.txt"
    ));
    map.appendCorpusString(
      sourceCorpus.toString("utf-8"),
      targetCorpus.toString("utf-8")
    );

    // append saved alignments
    const sourceSavedAlignments = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/greek.txt"
    ));
    const targetSavedAlignments = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/english.txt"
    ));
    map.appendSavedAlignmentsString(
      sourceSavedAlignments.toString("utf-8"),
      targetSavedAlignments.toString("utf-8")
    );

    const unalignedPair = [
      "Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ.",
      "The book of the genealogy of Jesus Christ, son of David, son of Abraham:"
    ];
    const suggestions = map.predict(unalignedPair[0], unalignedPair[1], 5);

    const stuff = [
      suggestions[0].toString(),
      suggestions[1].toString(),
      suggestions[2].toString(),
      suggestions[3].toString(),
      suggestions[4].toString()
    ];

    // noinspection TsLint
    console.log("corpus and saved alignments\n", stuff);
  });
});

//
// 1. is phrase, commonality
// 2. lowercase the data keys
// TODO: 3. focus on integration. I/O.
// TODO: 4. lemma
// TODO: 5. performance
// TODO: 6. tc does not have an easy way to give us the corpus.
// TODO: 7. improve filtered corpus metrics.
// to write tests we can get real alignments and develop metrics for how closely the alignment matches the real alignment.
// this will allow us to set a bar for the minimum alignment ratio.
// we have the book of titus already aligned so we can use this for the comparision.
