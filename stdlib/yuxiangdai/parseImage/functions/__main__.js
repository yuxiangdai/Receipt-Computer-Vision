/**
* A basic Hello World function
* @param {string} name Who you're saying hello to
* @returns {string}
*/
module.exports = (name = 'world', context, callback) => {
  const vision = require('@google-cloud/vision');
  const client = new vision.ImageAnnotatorClient();
  const fileName = process.env.PWD + '/longos1.jpg';
  callback(null, `hello ${name}`);

};