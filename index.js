#!/usr/bin/env node

// load environment variables
require('dotenv').config();
const com = require('commander');
const { defAction, synAction, antAction, exAction } = require('./actions');

com
  .version('1.0.0')
  .command('def <word>')
  .action(async word => {
    defAction(word);
  });

com
  .version('1.0.0')
  .command('syn <word>')
  .action(async word => {
    synAction(word);
  });

com
  .version('1.0.0')
  .command('ant <word>')
  .action(async word => {
    antAction(word);
  });

com
  .version('1.0.0')
  .command('ex <word>')
  .action(async word => {
    exAction(word);
  });

com.parse(process.argv);