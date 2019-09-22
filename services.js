const axios = require('axios').default;
const ora = require('ora');
const url = require('url');

const getRequest = async apiURL => {
  const spinner = ora('Loading!').start();
  try {
    const result = await axios.get(`${apiURL}?api_key=${process.env.API_KEY}`);
    spinner.stop();
    return result;
  } catch (err) {
    spinner.stop();
    if (err.message.includes(400)) {
      throw new Error('No data available');
    } else {
      throw err;
    }
  }
};

exports.getRandomWord = async () => {
  const apiURL = url.resolve(process.env.API_URL, 'words/randomWord');
  const response = await getRequest(apiURL);
  return response.data;
};

exports.getDefinitions = async word => {
  const apiURL = url.resolve(process.env.API_URL, `word/${word}/definitions`);
  const response = await getRequest(apiURL);
  return response.data;
};

exports.getRelatedWords = async word => {
  const apiURL = url.resolve(process.env.API_URL, `word/${word}/relatedWords`);
  const response = await getRequest(apiURL);
  return response.data;
};

exports.getExamples = async word => {
  const apiURL = url.resolve(process.env.API_URL, `word/${word}/examples`);
  const response = await getRequest(apiURL);
  return response.data;
};
