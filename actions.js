const { displayData, displayDef, displaySyn, displayAnt, displayEx, displayAll } = require('./helpers');
const { getRandomWord } = require('./services');

exports.defAction = async word => {
  displayData(displayDef, word);
};

exports.synAction = async word => {
  displayData(displaySyn, word);
};

exports.antAction = async word => {
  displayData(displayAnt, word);
};

exports.exAction = async word => {
  displayData(displayEx, word);
};

exports.allAction = async word => {
  displayData(displayAll, word);
};
