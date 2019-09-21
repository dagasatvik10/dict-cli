const chalk = require('chalk');

const log = console.log;

exports.success = msg => {
  log(chalk.green(msg));
};

exports.error = msg => {
  log(chalk.red(msg));
};

exports.warn = msg => {
  log(chalk.yellow(msg));
};

exports.info = msg => {
  log(msg);
};
