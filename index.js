#!/usr/bin/env node

// load environment variables
require('dotenv').config();
const com = require('commander');
const { defAction } = require('./actions');

com
  .version('1.0.0')
  .command('def <word>')
  .action(async word => {
    defAction(word);
  });

com.parse(process.argv);
