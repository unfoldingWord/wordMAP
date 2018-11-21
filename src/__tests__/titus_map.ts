import * as fs from "fs-extra";
import * as path from "path";
import Alignment from "../structures/Alignment";
import {makeMockAlignment, scoreSuggestion} from "../util/testUtils";
import WordMap from "../WordMap";

describe("MAP predictions in Titus", () => {
  const greek = path.join(__dirname, "fixtures/corpus/tit/greek.txt");
  const english = path.join(__dirname, "fixtures/corpus/tit/english.txt");
  const map = new WordMap();
  loadCorpus(map, greek, english);

  it("predicts the first verse", () => {
    const unalignedPair = [
      "Παῦλος, δοῦλος Θεοῦ, ἀπόστολος δὲ Ἰησοῦ Χριστοῦ, κατὰ πίστιν ἐκλεκτῶν Θεοῦ, καὶ ἐπίγνωσιν ἀληθείας, τῆς κατ’ εὐσέβειαν",
      "Paul a servant of God and an apostle of Jesus Christ for the faith of God s chosen people and the knowledge of the truth that agrees with godliness"
    ];
    const suggestions = map.predict(unalignedPair[0], unalignedPair[1], 2);
    const chapterOneAlignmentPath = path.join(
      __dirname,
      "fixtures/corpus/tit/alignmentData/1.json"
    );
    scoreSuggestion(suggestions[0], getAlignments(chapterOneAlignmentPath, 1));
    console.log("suggestions\n", suggestions.map((s) => {
      return s.toString();
    }).join("\n"));
  });

  it("predicts the third verse with a benchmark", () => {
    const secondUnalignedPair = [
      "ἐφανέρωσεν δὲ καιροῖς ἰδίοις τὸν λόγον αὐτοῦ ἐν κηρύγματι, ὃ ἐπιστεύθην ἐγὼ, κατ’ ἐπιταγὴν τοῦ Σωτῆρος ἡμῶν, Θεοῦ;",
      "At the right time he revealed his word by the message that he trusted me to deliver I was to do this by the command of God our savior"
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
      "suggestions\n",
      map.predict(secondUnalignedPair[0], secondUnalignedPair[1], 2)
        .map((s) => {
          return s.toString();
        })
        .join("\n")
    );
    console.log(
      "benchmarks\n",
      map.predictWithBenchmark(
        secondUnalignedPair[0],
        secondUnalignedPair[1],
        benchmark,
        2
      ).map((s) => {
        return s.toString();
      }).join("\n")
    );
  });
});

/**
 * Loads corpus into the map
 * @param {WordMap} map
 * @param {string} sourcePath
 * @param {string} targetPath
 */
function loadCorpus(map: WordMap, sourcePath: string, targetPath: string) {
  const sourceCorpus = fs.readFileSync(sourcePath);
  const targetCorpus = fs.readFileSync(targetPath);
  map.appendCorpusString(
    sourceCorpus.toString("utf-8"),
    targetCorpus.toString("utf-8")
  );
}

/**
 * Reads the alignment data from a data file
 * @param {string} filePath
 * @param {number} verse - the verse for which alignments will be returned
 * @return {object}
 */
function getAlignments(filePath: string, verse: number): object {
  const verseAlignments = JSON.parse(fs.readFileSync(filePath)
    .toString("utf-8"));
  return verseAlignments[verse.toString()].alignments;
}
