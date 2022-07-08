const chalk = require('chalk');
const { removeHtmlTags } = require('./utils');

/**
 *
 * @param {string} text
 */
const log = (text) => {
  console.log(removeHtmlTags(text));
};

/**
 * print success message(green color)
 * @param {string} msg
 */
exports.success = (msg) => {
  log(chalk.green(msg));
};

/**
 * print error message(red color)
 * @param {string} msg
 */
exports.error = (msg) => {
  log(chalk.red(msg));
};

/**
 * print warning message(yellow color)
 * @param {string} msg
 */
exports.warn = (msg) => {
  log(chalk.yellow(msg));
};

/**
 * print info message(default color)
 * @param {string} msg
 */
exports.info = (msg) => {
  log(msg);
};
