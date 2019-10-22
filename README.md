[![Build Status](https://travis-ci.org/translationCoreApps/wordMAP.svg?branch=master)](https://travis-ci.org/translationCoreApps/wordMAP)
[![codecov](https://codecov.io/gh/translationCoreApps/wordmap/branch/master/graph/badge.svg)](https://codecov.io/gh/translationCoreApps/wordmap)
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
npm i wordmap
```

## Usage

Here's a minimum setup example.
```
const map = new WordMAP();
map.appendAlignmentMemoryString("Tag", "day");
const source = "Guten Tag";
const target = "Good morning";
const suggestions = map.predict(source, target);
```

## Learn more
Want to learn more? Read [WHITEPAPER.md](./WHITEPAPER.md).