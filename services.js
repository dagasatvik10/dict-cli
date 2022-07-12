const axios = require('axios').default;
const ora = require('ora');

const logger = require('./logger');

const { DEFAULT_DEFINITIONS_LIMIT, DEFAULT_RELATED_WORDS_LIMIT, DEFAULT_EXAMPLES_LIMIT } = require('./constants');

/**
 *
 * @param {string} apiURL
 * @param {Object} params
 * @returns
 */
const getRequest = async (apiURL, params = undefined) => {
  // Start the spinner on each API call start
  const spinner = ora('Loading!').start();
  try {
    const result = await axios.get(`${apiURL}`, {
      params: {
        api_key: process.env.API_KEY,
        ...params,
      },
    });
    // Stop the spinner on API call end
    spinner.stop();
    return result;
  } catch (err) {
    // Stop the spinner on API call end
    spinner.stop();
    // check status code
    if (err.response.status === 429) {
      logger.error('Too many requests');
      logger.info('This cli is only for demo purpose and does not support too many API calls');
    }
    if (String(err.response.status).startsWith('4')) {
      throw new Error('No data available');
    } else {
      throw err;
    }
  }
};

/**
 *
 * @returns {Promise}
 */
exports.getRandomWord = async () => {
  const apiURL = new URL('./words.json/randomWord', process.env.API_URL).toJSON();
  const response = await getRequest(apiURL);
  return response.data;
};

/**
 *
 * @param {string} word - Word to get definitions for
 * @param {number} [limit=10] - Max number of definitions
 * @returns {Promise}
 */
exports.getDefinitions = async (word, limit = DEFAULT_DEFINITIONS_LIMIT) => {
  const apiURL = new URL(`./word.json/${word}/definitions`, process.env.API_URL).toJSON();
  const response = await getRequest(apiURL, { limit });
  return response.data;
};

/**
 *
 * @param {string} word - Word to get related words for
 * @param {string} relationshipType - Type of related words
 * @param {number} [limitPerRelationshipType=5] - Max number of related words
 * @returns {Promise}
 */
exports.getRelatedWords = async (word, relationshipTypes, limitPerRelationshipType = DEFAULT_RELATED_WORDS_LIMIT) => {
  const apiURL = new URL(`./word.json/${word}/relatedWords`, process.env.API_URL).toJSON();
  const response = await getRequest(apiURL, { relationshipTypes, limitPerRelationshipType });
  return response.data;
};

/**
 *
 * @param {string} word - Word to get examples for
 * @param {number} [limit=5] - Max number of examples
 * @returns
 */
exports.getExamples = async (word, limit = DEFAULT_EXAMPLES_LIMIT) => {
  const apiURL = new URL(`./word.json/${word}/examples`, process.env.API_URL).toJSON();
  const response = await getRequest(apiURL, { limit });
  return response.data;
};
