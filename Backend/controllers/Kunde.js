const { testSelect, testSelectMitVariablen } = require('../globaleDinge');

//Zur Datenbank Verbinden
const registerHandler = (req, res) => {
  testSelectMitVariablen();
  res.status(200).send('Hello World');
};

module.exports = {
  registerHandler,
};
