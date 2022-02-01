const { SendAuthCode, RegisterToDatabase } = require('../globaleDinge');

//Kunden den Auth-Code senden
const SendAuthCodeHandler = (req, res) => {
  SendAuthCode(req.body).then((code) => {
    code != 'noUser' ? res.status(200).send(code) : res.status(400).send('User bereits vorhanden!');
  });
};

//Kunden registrieren
const RegisterIntoDatabase = (req, res) => {
  let data = req.body;
  try {
    //Eintrag in die Datenbank
    RegisterToDatabase(data).then((value) => {
      res.status(200).send(value);
    });
  } catch (err) {
    if (err) console.log(err);
    res.status(400).send(err);
  }
};

module.exports = {
  SendAuthCodeHandler,
  RegisterIntoDatabase,
};
