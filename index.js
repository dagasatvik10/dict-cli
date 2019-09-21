#!/usr/bin/env node

// load environment variables
require('dotenv').config();
const com = require('commander');
const { defAction, synAction, antAction, exAction, allAction, wordOfDayAction } = require('./actions');

let runWordOfDay = true;

com.version('1.0.0');

com
  .command('def <word>')
  .description('Definitions of the word')
  .action(async word => {
    defAction(word);
    runWordOfDay = false;
  });

com
  .command('syn <word>')
  .description('Synonyms of the word')
  .action(async word => {
    synAction(word);
    runWordOfDay = false;
  });

com
  .command('ant <word>')
  .description('Antonyms of the word')
  .action(async word => {
    antAction(word);
    runWordOfDay = false;
  });

com
  .command('ex <word>')
  .description('Examples of the word')
  .action(async word => {
    exAction(word);
    runWordOfDay = false;
  });

com
  .command('dict <word>')
  .description('All information about the word')
  .action(async word => {
    allAction(word);
    runWordOfDay = false;
  });

com.parse(process.argv);

if (runWordOfDay) {
  wordOfDayAction();
}
