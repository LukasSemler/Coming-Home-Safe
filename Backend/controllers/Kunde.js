const { SendAuthCode, RegisterToDatabase, SendAuthCodePerMail, Login } = require('../globaleDinge');

//Kunden den Auth-Code senden
const SendAuthCodeHandler = (req, res) => {
  //Email aus übergabe rausziehen
  const { email, name } = req.body;

  //Vom Server den Auth-Code erhalten und Email schicken
  SendAuthCode(email).then((code) => {
    //Email mit Code an User senden
    SendAuthCodePerMail(code, email, name);
    //Serverstatus und code ausgeben
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

const LoginHandler = (req, res) => {
  const data = req.body;
  Login(data).then((returnedKunde) => {
    if (returnedKunde != 'Kein Kunde') {
      res.status(200).json(returnedKunde);
    } else {
      res.status(400).send('Kein Kunde');
    }
  });
};

module.exports = {
  SendAuthCodeHandler,
  RegisterIntoDatabase,
  LoginHandler,
};
