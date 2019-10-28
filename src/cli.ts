#! /usr/bin/env node

import * as fs from "fs-extra";
import * as yargs from "yargs";
import WordMap from "./";

console.log("******************************************************");
console.log("* Multi-Lingual Word Alignment Prediction (Word MAP) *");
console.log("******************************************************\n");

const args = yargs.usage(
  "Usage: wordmap -c [source corpus path] [target corpus path] -s [source sentence] [target sentence]")
  .help("help")
  .alias("h", "help")
  .alias("c", "corpus")
  .describe("c", "Paths to the primary and secondary corpus text")
  .array("c")
  .alias("s", "sentence")
  .describe("s", "The primary and secondary sentences to align")
  .array("s")
  .alias("o", "out")
  .describe("o", "Output file path")
  .default("o", "./alignment_predictions.json")
  .alias("p", "predictions")
  .describe("p", "The number of alignment predictions to generate")
  .default("p", 1)
  .strict()
  .demandOption(["c", "s"])
  .argv;

console.log(args.c, args.s, args.p);
const map = new WordMap();

const start = new Date().getTime(); // start clock

console.log("Reading corpus...");

const sourceCorpus = fs.readFileSync(args.c[0]);
const targetCorpus = fs.readFileSync(args.c[1]);

console.log("Indexing corpus...");

map.appendCorpusString(
  sourceCorpus.toString("utf-8"),
  targetCorpus.toString("utf-8")
);

console.log("Predicting alignments...");
const suggestions = map.predict(args.s[0], args.s[1], args.p);

console.log("Writing predictions to output...");

const alignmentData = [];
for (const s of suggestions) {
  alignmentData.push(s.toJSON());
}
fs.writeFileSync(args.o, JSON.stringify(alignmentData));

const end = new Date().getTime(); // end clock
const duration = end - start;

console.log(`Finished! ${duration / 1000.0}s`);
