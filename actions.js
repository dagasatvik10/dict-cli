const logger = require('./logger');
const { parseRelatedWordsResponse } = require('./helpers');
const { getDefinitions, getExamples, getRandomWord, getRelatedWords } = require('./services');

exports.defAction = async word => {
  try {
    const result = await getDefinitions(word);
    result.forEach(defs => {
      logger.success(defs.text);
    });
  } catch (err) {
    logger.error(err);
  }
};

exports.synAction = async word => {
  try {
    const result = await getRelatedWords(word);
    const parsedResult = parseRelatedWordsResponse(result);
    if (parsedResult && parsedResult.synonym && parsedResult.synonym.length) {
      parsedResult.synonym.forEach(s => {
        logger.success(s);
      });
    } else {
      logger.error(`No synonyms for ${word}`);
    }
  } catch (err) {
    logger.error(err);
  }
};

exports.antAction = async word => {
  try {
    const result = await getRelatedWords(word);
    const parsedResult = parseRelatedWordsResponse(result);
    if (parsedResult && parsedResult.antonym && parsedResult.antonym.length) {
      parsedResult.antonym.forEach(s => {
        logger.success(s);
      });
    } else {
      logger.error(`No synonyms for ${word}`);
    }
  } catch (err) {
    logger.error(err);
  }
};

exports.exAction = async word => {
  try {
    const result = await getExamples(word);
    if (result && result.examples) {
      result.examples.forEach(e => {
        logger.success(e.text);
      });
    }
  } catch (err) {
    logger.error(err);
  }
};
