[![Build Status](https://travis-ci.org/unfoldingWord/wordMAP.svg?branch=master)](https://travis-ci.org/unfoldingWord/wordMAP)
[![codecov](https://codecov.io/gh/unfoldingWord/wordmap/branch/master/graph/badge.svg)](https://codecov.io/gh/unfoldingWord/wordmap)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

# wordMAP
> Multi-Lingual Word Alignment Prediction


Word alignment prediction is the process of associating (mapping) words from some primary text with corresponding words in a secondary text. 
his tool uses statistical algorithms to determine which words or phrases in two texts are equivalent in meaning.

With wordMAP you can create amazing translation tools that:

* Ensure all terms and phrases in the primary text have a proper translation in the secondary text.
* Provide in-context vocabulary suggestions to the translator.
* Helps prevent inconsistencies in the translation.
* Pre-translates text.

## Installation

```
yarn add wordmap
```

## Usage

Here's a minimum setup example.
```
const map = new WordMAP();
map.appendAlignmentMemoryString("Tag", "day");
const source = "Guten Tag";
const target = "Good morning";
const suggestions = map.predict(source, target);
console.log(suggestions[0].toString());
// produces -> "0 [0|n:guten->n:good] [0|n:tag->n:morning]"
```

## Use Cases

* Aligning a primary text with a secondary text e.g. when generating word maps for gateway languages.
* Aligning a secondary text with a ternary text.
* Aligning a primary text to a ternary text (using the secondary as a proxy)

## The Need

Existing tools require large data sets, complex running environments, and are usually limited to running in a server environment.

We need a tool that:

* runs on the client with minimal configuration.
* works with existing web browser technology.
* integrates with translationCore and related tools.
* works without an Internet connection.
* does not have a minimum corpus size.
* requires minimal system resources.

## Learn more
Want to learn more? Read [WHITEPAPER.md](./WHITEPAPER.md).

## Development
When publishing to npm be sure to use the command `yarn deploy`.
This will publish the proper module structure to npm.