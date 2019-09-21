const {
  displayData,
  displayDef,
  displaySyn,
  displayAnt,
  displayEx,
  displayAll,
  displayWordOfDay,
} = require('./helpers');

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

exports.wordOfDayAction = async () => {
  await displayWordOfDay();
};
