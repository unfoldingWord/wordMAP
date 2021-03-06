import * as fs from "fs-extra";
import * as path from "path";
import {
  makeMockAlignment,
  tokenizeComplexMockSentence
} from "../../util/testUtils";
import {Alignment, WordMap} from "../index";

describe("MAP", () => {

  // it("predicts alignments with the sentence pair the same as corpus", () => {
  //     const map = new WordMap();
  //     const source = "Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ.";
  //     const target = "The book of the genealogy of Jesus Christ, son of David, son of Abraham:";
  //
  //     map.appendCorpusString(source, target);
  //     const suggestions = map.predict(source, target, 5);
  //     console.log("input as corpus\n", suggestions.map((s) => {
  //         return s.toString();
  //       })
  //     );
  //   }
  // );

  // it("has no corpus", () => {
  //   const map = new MAP();
  //   const suggestions = map.predict("hello", "olleh dlrow");
  //   expect(suggestions.length).toEqual(1);
  //
  //   const s1 = suggestions[0];
  //   expect(s1.getPredictions().length).toEqual(1);
  //   expect(s1.getPredictions()[0].alignment.key).toEqual("n:hello->n:olleh:dlrow");
  // });

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

  it("predicts from alignment memory", () => {
    const map = new WordMap();
    // append alignment memory
    const sourceAlignmentMemory = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/greek.txt"
    ));
    const targetAlignmentMemory = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/english.txt"
    ));
    map.appendAlignmentMemoryString(
      sourceAlignmentMemory.toString("utf-8"),
      targetAlignmentMemory.toString("utf-8")
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

    console.log("alignment memory\n", stuff);
  });

  it("predicts from alignment memory with lemma fallback", () => {
    const map = new WordMap();
    // append alignment memory
    const sourceAlignmentMemory = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/greek.txt"
    ));
    const targetAlignmentMemory = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/english.txt"
    ));
    map.appendAlignmentMemoryString(
      sourceAlignmentMemory.toString("utf-8"),
      targetAlignmentMemory.toString("utf-8")
    );

    const unalignedPair = [
      tokenizeComplexMockSentence(
        "Βίβλος γενέσεωςalt:γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ."),
      "The book of the genealogy of Jesus Christ, son of David, son of Abraham:"
    ];
    const suggestions = map.predict(unalignedPair[0], unalignedPair[1], 5);

    expect(suggestions[0].getPredictions()[0].key).toEqual(
      "n:βίβλος->n:the:book:of");
    expect(suggestions[0].getPredictions()[1].key).toEqual(
      "n:γενέσεωςalt->n:the:genealogy:of");
  });

  it.skip("predicts from corpus", () => {
    const map = new WordMap();

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
    console.log(
      "corpus (1)\n",
      map.predict(unalignedPair[0], unalignedPair[1], 20).map((s) => {
        return s.toString();
      })
    );

    // run it again to make sure things work

    const secondUnalignedPair = [
      "Ἀβραὰμ ἐγέννησεν τὸν Ἰσαὰκ, Ἰσαὰκ δὲ ἐγέννησεν τὸν Ἰακὼβ, Ἰακὼβ δὲ ἐγέννησεν τὸν Ἰούδαν καὶ τοὺς ἀδελφοὺς αὐτοῦ,",
      "Abraham begat Isaac, and Isaac begat Jacob, and Jacob begat Judah and his brothers."
    ];
    const benchmark: Alignment[] = [];
    benchmark.push(makeMockAlignment("Ἀβραὰμ", "Abraham"));
    benchmark.push(makeMockAlignment("ἐγέννησεν", "begat"));
    benchmark.push(makeMockAlignment("Ἰσαὰκ", "Isaac"));
    benchmark.push(makeMockAlignment("δὲ", ""));
    benchmark.push(makeMockAlignment("τὸν", "and"));
    benchmark.push(makeMockAlignment("Ἰακὼβ", "Jacob"));
    benchmark.push(makeMockAlignment("δὲ", ""));
    benchmark.push(makeMockAlignment("Ἰούδαν", "Judah"));
    benchmark.push(makeMockAlignment("καὶ", "and"));
    benchmark.push(makeMockAlignment("τοὺς", ""));
    benchmark.push(makeMockAlignment("ἀδελφοὺς", "brothers"));
    benchmark.push(makeMockAlignment("αὐτοῦ", "his"));

    console.log(
      "corpus (2)\n",
      map.predict(secondUnalignedPair[0], secondUnalignedPair[1], 2)
        .map((s) => {
          return s.toString();
        })
    );
    console.log(
      "corpus (2): benchmark\n",
      map.predictWithBenchmark(
        secondUnalignedPair[0],
        secondUnalignedPair[1],
        benchmark,
        2
      ).map((s) => {
        return s.toString();
      })
    );

    // make sure we get the same output as at first

    const thirdSuggestions = map.predict(unalignedPair[0], unalignedPair[1], 5);

    const stuff3 = thirdSuggestions.map((s) => {
      return s.toString();
    });

    // noinspection TsLint
    // console.log("corpus (3)\n", stuff3);
  });

  describe("ngram length", () => {
    it("excludes alignment memory that exceeds the max ngram length", () => {
      const map = new WordMap({targetNgramLength: 3});
      map.appendAlignmentMemoryString("φιλοτέκνους", "and children");
      map.appendAlignmentMemoryString("φιλάνδρους", "love their own husbands");
      const suggestions = map.predict(
        "ἵνα σωφρονίζωσι τὰς νέας, φιλάνδρους εἶναι, φιλοτέκνους",
        "In this way they may train the younger women to love their own husbands and children"
      );
      const predictions = suggestions[0].getPredictions();
      expect(predictions).toHaveLength(7);
      expect(predictions[4].source.getTokens()[0].toString()).toEqual("φιλάνδρους");
      expect(predictions[4].key).not.toEqual(
        "n:φιλάνδρους->n:love:their:own:husbands");
      expect(predictions[6].key).toEqual("n:φιλοτέκνους->n:and:children");
    });

    it("uses alignment memory that falls within expanded ngram length", () => {
      const map = new WordMap({targetNgramLength: 4});

      map.appendAlignmentMemoryString("φιλοτέκνους", "and children");
      map.appendAlignmentMemoryString("φιλάνδρους", "love their own husbands");
      const suggestions = map.predict(
        "ἵνα σωφρονίζωσι τὰς νέας, φιλάνδρους εἶναι, φιλοτέκνους",
        "In this way they may train the younger women to love their own husbands and children"
      );
      const predictions = suggestions[0].getPredictions();
      expect(predictions).toHaveLength(7);
      expect(predictions[4].source.getTokens()[0].toString()).toEqual("φιλάνδρους");
      expect(predictions[4].key).toEqual(
        "n:φιλάνδρους->n:love:their:own:husbands");
      expect(predictions[6].key).toEqual("n:φιλοτέκνους->n:and:children");
    });
  });

  it.skip("predicts from corpus and alignment memory", () => {
    const map = new WordMap();

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

    // append alignment memory
    const sourceAlignmentMemory = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/greek.txt"
    ));
    const targetAlignmentMemory = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corrections/english.txt"
    ));
    map.appendAlignmentMemoryString(
      sourceAlignmentMemory.toString("utf-8"),
      targetAlignmentMemory.toString("utf-8")
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
    console.log("corpus and alignment memory\n", stuff);
  });
});

//
// 1. is phrase, commonality
// 2. lowercase the data keys
// TODO: 3. focus on integration. I/O.

// add option to enter answer key (alignments) to return the suggestions that match the answer key.
// This will be more powerful than a genetic algorithm because it will allow us to compare
// the prediction output with our expected output and figure out what we did wrong.

// 4.1. parse greek bible => resource/bibles/greek/ugnt
// parse english bible => https://git.door43.org/tc01/English_tit/src/branch/master/57-TIT.usfm
// parse alignment json from tC for consumption in MAP (https://git.door43.org/tc01/English_tit.git).
// TODO: 4.4. score how closely the results match expected output (Titus).
// TODO: 4.5. genetic algorithm to generate weights
// TODO: 4.6. graph output.

// TODO: 4. lemma
// TODO: 5. performance
// TODO: 6. tc does not have an easy way to give us the corpus.
// TODO: 7. improve filtered corpus metrics.
// to write tests we can get real alignments and develop metrics for how closely the alignment matches the real alignment.
// this will allow us to set a bar for the minimum alignment ratio.
// we have the book of titus already aligned so we can use this for the comparision.
