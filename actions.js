const ora = require('ora');
const logger = require('./logger');
const { parseRelatedWordsResponse } = require('./helpers');
const { getDefinitions, getExamples, getRandomWord, getRelatedWords } = require('./services');

exports.defAction = async word => {
  const spinner = ora('Loading Definitions').start();
  try {
    const result = await getDefinitions(word);
    spinner.stop();
    result.forEach(defs => {
      logger.success(defs.text);
    });
  } catch (err) {
    spinner.stop();
    logger.error(err);
  }
};

exports.synAction = async word => {
  const spinner = ora('Loading Synonyms').start();
  try {
    const result = await getRelatedWords(word);
    spinner.stop();
    const parsedResult = parseRelatedWordsResponse(result);
    if (parsedResult && parsedResult.synonym && parsedResult.synonym.length) {
      parsedResult.synonym.forEach(s => {
        logger.success(s);
      });
    } else {
      logger.error(`No synonyms for ${word}`);
    }
  } catch (err) {
    spinner.stop();
    logger.error(err);
  }
};

exports.antAction = async word => {
  const spinner = ora('Loading Antonyms').start();
  try {
    const result = await getRelatedWords(word);
    spinner.stop();
    const parsedResult = parseRelatedWordsResponse(result);
    if (parsedResult && parsedResult.antonym && parsedResult.antonym.length) {
      parsedResult.antonym.forEach(s => {
        logger.success(s);
      });
    } else {
      logger.error(`No synonyms for ${word}`);
    }
  } catch (err) {
    spinner.stop();
    logger.error(err);
  }
};

exports.exAction = async word => {
  const spinner = ora('Loading Examples').start();
  try {
    const result = await getExamples(word);
    spinner.stop();
    if (result && result.examples) {
      result.examples.forEach(e => {
        logger.success(e.text);
      });
    }
  } catch (err) {
    spinner.stop();
    logger.error(err);
  }
};
