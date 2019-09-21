const chalk = require('chalk');
const logger = require('./logger');
const Promise = require('bluebird');
const { getDefinitions, getExamples, getRelatedWords, getRandomWord } = require('./services');

const parseRelatedWordsResponse = data => {
  if (data && data.length) {
    const result = data.reduce((acc, v) => {
      acc[v.relationshipType] = v.words;
      return acc;
    }, {});
    return result;
  }
  return {};
};

exports.displayData = async (displayFn, params) => {
  try {
    if (params) {
      if (Array.isArray(params)) {
        await displayFn(...params);
      } else {
        await displayFn(params);
      }
    } else {
      await displayFn();
    }
  } catch (err) {
    if (err.message) {
      logger.error(err.message);
    } else {
      logger.error(err);
    }
    logger.info('\n');
  }
};

exports.displayDef = async (word, definitions) => {
  const result = definitions || (await getDefinitions(word));
  if (result && result.length > 0) {
    logger.info('Definitions');
    result.forEach(defs => {
      logger.success(defs.text);
    });
    logger.info('\n');
  } else {
    throw new Error(`No definitions for ${word}`);
  }
};

exports.displaySyn = async (word, relatedWords) => {
  const result = relatedWords || (await getRelatedWords(word));
  const parsedResult = parseRelatedWordsResponse(result);
  if (parsedResult && parsedResult.synonym && parsedResult.synonym.length > 0) {
    logger.info('Synonyms');
    parsedResult.synonym.forEach(s => {
      logger.success(s);
    });
    logger.info('\n');
  } else {
    throw new Error(`No synonyms for ${word}`);
  }
};

exports.displayAnt = async (word, relatedWords) => {
  const result = relatedWords || (await getRelatedWords(word));
  const parsedResult = parseRelatedWordsResponse(result);
  if (parsedResult && parsedResult.antonym && parsedResult.antonym.length > 0) {
    logger.info('Antonyms');
    parsedResult.antonym.forEach(s => {
      logger.success(s);
    });
    logger.info('\n');
  } else {
    throw new Error(`No antonyms for ${word}`);
  }
};

exports.displayEx = async (word, examples) => {
  const result = examples || (await getExamples(word));
  if (result && result.examples && result.examples.length > 0) {
    logger.info('Examples');
    result.examples.forEach(e => {
      logger.success(e.text);
    });
    logger.info('\n');
  } else {
    throw new Error(`No examples for ${word}`);
  }
};

exports.displayAll = async word => {
  const [definitions, examples, relatedWords] = await Promise.all([
    getDefinitions(word),
    getExamples(word),
    getRelatedWords(word),
  ]);

  this.displayData(this.displayDef, [word, definitions]);

  this.displayData(this.displayEx, [word, examples]);

  this.displayData(this.displayAnt, [word, relatedWords]);

  this.displayData(this.displaySyn, [word, relatedWords]);
};

exports.displayWordOfDay = async () => {
  try {
    const result = await getRandomWord();
    logger.info('Word Of The Day');
    logger.info(chalk.bold.greenBright(result.word.toUpperCase()));
    logger.info('\n');
    await this.displayAll(result.word);
  } catch (err) {
    if (err.message) {
      logger.error(err.message);
    } else {
      logger.error(err);
    }
    logger.info('\n');
  }
};
