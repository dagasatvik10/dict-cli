const logger = require('./logger');
const { getDefinitions, getExamples, getRelatedWords } = require('./services');

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
      await displayFn(params);
    } else {
      displayFn();
    }
  } catch (err) {
    logger.error(err);
  }
};

exports.displayDef = async word => {
  const result = await getDefinitions(word);
  if (result && result.length) {
    result.forEach(defs => {
      logger.success(defs.text);
    });
  } else {
    throw new Error(`No definitions for ${word}`);
  }
};

exports.displaySyn = async word => {
  const result = await getRelatedWords(word);
  const parsedResult = parseRelatedWordsResponse(result);
  if (parsedResult && parsedResult.synonym && parsedResult.synonym.length) {
    parsedResult.synonym.forEach(s => {
      logger.success(s);
    });
  } else {
    throw new Error(`No synonyms for ${word}`);
  }
};

exports.displayAnt = async word => {
  const result = await getRelatedWords(word);
  const parsedResult = parseRelatedWordsResponse(result);
  if (parsedResult && parsedResult.antonym && parsedResult.antonym.length) {
    parsedResult.antonym.forEach(s => {
      logger.success(s);
    });
  } else {
    throw new Error(`No antonyms for ${word}`);
  }
};

exports.displayEx = async word => {
  const result = await getExamples(word);
  if (result && result.examples) {
    result.examples.forEach(e => {
      logger.success(e.text);
    });
  } else {
    throw new Error(`No examples for ${word}`);
  }
};
