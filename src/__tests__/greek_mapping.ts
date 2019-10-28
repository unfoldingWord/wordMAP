import * as fs from "fs-extra";
import * as path from "path";
import WordMap from "../core/WordMap";

describe("Align Greek Sources", () => {
  it("aligns Wescott Hort to UGNT", () => {
    // This demonstrates aligning greek texts with some minor differences together.
    const ugnt = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corpus/mat/ugnt.txt"
    )).toString("utf-8").trim();
    const wh = fs.readFileSync(path.join(
      __dirname,
      "fixtures/corpus/mat/wh.txt"
    )).toString("utf-8").trim();

    const map = new WordMap();
    map.appendCorpusString(ugnt, wh);

    const sourceVerses = ugnt.split("\n");
    const targetVerses = wh.split("\n");
    const alignments = [];
    for (let i = 0, len = sourceVerses.length; i < len; i++) {
      const verseSuggestions = map.predict(sourceVerses[i], targetVerses[i]);
      if (verseSuggestions.length > 0) {
        alignments.push(verseSuggestions[0].toJSON(true));
      } else {
        throw new Error("Unable to align verses at " + i.toString() + " " + sourceVerses[i] + " <====> " + targetVerses[i]);
      }
    }

    // fs.writeFileSync("greek_alignment.json", JSON.stringify(alignments));
  });
});
