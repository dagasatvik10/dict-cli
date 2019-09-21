const ora = require('ora');
const logger = require('./logger');
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
