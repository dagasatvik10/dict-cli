const chalk = require('chalk');
const logger = require('./logger');
const Promise = require('bluebird');
const inquirer = require('inquirer');
const { getDefinitions, getExamples, getRelatedWords, getRandomWord } = require('./services');

const parseRelatedWordsResponse = data => {
  let result = { antonym: [], synonym: [] };
  if (data && data.length) {
    result = data.reduce((acc, v) => {
      acc[v.relationshipType] = v.words;
      return acc;
    }, result);
    return result;
  }
  return result;
};

const parseDefinitionsResponse = data => {
  if (data && data.length) {
    return data.map(d => d.text);
  }
  return [];
};

const parseExamplesResponse = data => {
  if (data && data.examples && data.examples.length) {
    return data.examples.map(e => e.text);
  }
  return [];
};

const parseAllResponses = responses => {
  const [definitionsRes, examplesRes, relatedWordsRes] = responses;
  const relatedWords = parseRelatedWordsResponse(relatedWordsRes);

  return {
    definitions: parseDefinitionsResponse(definitionsRes),
    synonyms: relatedWords.synonym,
    antonyms: relatedWords.antonym,
    examples: parseExamplesResponse(examplesRes),
  };
};

exports.displayData = async (displayFn, params) => {
  try {
    if (params) {
      if (Array.isArray(params)) {
        await displayFn(...params);
      } else {
        await displayFn(params);
      }
    } else {
      await displayFn();
    }
  } catch (err) {
    if (err.message) {
      logger.error(err.message);
    } else {
      logger.error(err);
    }
    logger.info('\n');
  }
};

exports.displayDef = async (word, definitions) => {
  const result = definitions || (await getDefinitions(word));
  if (result && result.length > 0) {
    logger.info('Definitions');
    result.forEach(defs => {
      logger.success(defs.text);
    });
    logger.info('\n');
  } else {
    throw new Error(`No definitions for ${word}`);
  }
};

exports.displaySyn = async (word, relatedWords) => {
  const result = relatedWords || (await getRelatedWords(word));
  const parsedResult = parseRelatedWordsResponse(result);
  if (parsedResult && parsedResult.synonym && parsedResult.synonym.length > 0) {
    logger.info('Synonyms');
    parsedResult.synonym.forEach(s => {
      logger.success(s);
    });
    logger.info('\n');
  } else {
    throw new Error(`No synonyms for ${word}`);
  }
};

exports.displayAnt = async (word, relatedWords) => {
  const result = relatedWords || (await getRelatedWords(word));
  const parsedResult = parseRelatedWordsResponse(result);
  if (parsedResult && parsedResult.antonym && parsedResult.antonym.length > 0) {
    logger.info('Antonyms');
    parsedResult.antonym.forEach(s => {
      logger.success(s);
    });
    logger.info('\n');
  } else {
    throw new Error(`No antonyms for ${word}`);
  }
};

exports.displayEx = async (word, examples) => {
  const result = examples || (await getExamples(word));
  if (result && result.examples && result.examples.length > 0) {
    logger.info('Examples');
    result.examples.forEach(e => {
      logger.success(e.text);
    });
    logger.info('\n');
  } else {
    throw new Error(`No examples for ${word}`);
  }
};

exports.displayAll = async word => {
  const [definitions, examples, relatedWords] = await Promise.all([
    getDefinitions(word),
    getExamples(word),
    getRelatedWords(word),
  ]);

  this.displayData(this.displayDef, [word, definitions]);

  this.displayData(this.displayEx, [word, examples]);

  this.displayData(this.displayAnt, [word, relatedWords]);

  this.displayData(this.displaySyn, [word, relatedWords]);
};

exports.displayWordOfDay = async () => {
  const result = await getRandomWord();
  logger.info('Word Of The Day');
  logger.info(chalk.bold.greenBright(result.word.toUpperCase()));
  logger.info('\n');
  await this.displayAll(result.word);
};

// jumble the given word
const jumbleWord = word => {
  const jumbledWordArr = word.split('');
  for (var i = jumbledWordArr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = jumbledWordArr[i];
    jumbledWordArr[i] = jumbledWordArr[j];
    jumbledWordArr[j] = temp;
  }
  const jumbledWord = jumbledWordArr.join('');
  if (jumbledWord === word) {
    return jumbleWord(word);
  }
  return jumbledWord;
};

// display a random question from the plethora of information
const getRandomQuestion = (word, wordInfo, isHint = false) => {
  const availableChoices = isHint ? ['jumble'] : [];
  for (let k in wordInfo) {
    if (wordInfo[k] && wordInfo[k].length && k !== 'examples') {
      availableChoices.push(k);
    }
  }

  const randomChoice = Math.floor(availableChoices.length * Math.random());

  let question;
  switch (availableChoices[randomChoice]) {
    case 'definitions':
      question = `Definition: ${wordInfo.definitions.shift()}`;
      break;
    case 'synonyms':
      question = `Synonym: ${wordInfo.synonyms.shift()}`;
      break;
    case 'antonyms':
      question = `Antonym: ${wordInfo.antonyms.shift()}`;
      break;
    case 'jumble':
      question = `Jumble: ${jumbleWord(word)}`;
      break;
  }
  return question;
};

// action to perform if the answer is wrong
const wrongAnswerAction = async (word, wordInfo) => {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'What do you want to do?',
      choices: [{ name: '1: Try again', value: 1 }, { name: '2: Hint', value: 2 }, { name: '3: Quit', value: 3 }],
    },
  ]);
  switch (answer.selection) {
    case 1:
      await askQuestion(word, wordInfo, 'Try Again');
      break;
    case 2:
      await askQuestion(word, wordInfo, 'HINT- ' + getRandomQuestion(word, wordInfo, true));
      break;
    case 3:
      logger.info('Correct Answer');
      logger.info(chalk.bold.greenBright(word.toUpperCase()));
      logger.info('\n');
      await this.displayAll(word);
      break;
  }
};

// ask the question and perform action based on the answer
const askQuestion = async (word, wordInfo, promptMessage) => {
  const question = promptMessage || getRandomQuestion(word, wordInfo);
  const answers = await inquirer.prompt([{ type: 'input', name: 'answer', message: 'Guess the word. ' + question }]);
  if (checkAnswer(answers.answer, word, wordInfo.synonyms)) {
    logger.success('Correct');
  } else {
    logger.success('Wrong Answer!');
    wrongAnswerAction(word, wordInfo);
  }
};

// match the answer entered with the word and synonyms of word
const checkAnswer = (answer, word, synonymsLeft) => {
  const answerLowerCase = answer && answer.toLowerCase();
  return answerLowerCase === word || synonymsLeft.indexOf(answerLowerCase) > -1;
};

exports.displayGame = async () => {
  const { word } = await getRandomWord();
  const apiResponses = await Promise.all([getDefinitions(word), getExamples(word), getRelatedWords(word)]);
  const wordInfo = parseAllResponses(apiResponses);
  logger.info(`Welcome to Game-A-Dict. Let's play`);
  logger.info('Please guess the word from the information.\n');
  askQuestion(word, wordInfo);
};
