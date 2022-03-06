const {
  SendAuthCode,
  RegisterToDatabase,
  SendAuthCodePerMail,
  Login,
  getUsersfromDB,
  changeAdmin,
  ChangeUserPassword,
} = require('../globaleDinge');

//Kunden den Auth-Code senden
const SendAuthCodeHandler = async (req, res) => {
  //Email aus übergabe rausziehen
  const { email, name } = req.body;

  //Vom Server den Auth-Code erhalten und Email schicken
  let code = await SendAuthCode(email);

  //Email mit Code an User senden
  if (code != 'noUser') {
    //Email an den User senden
    SendAuthCodePerMail(code, email, name);
    //Status an den axios call
    res.status(200).send(code);
  } else {
    res.status(400).send('User bereits vorhanden!');
  }
};

//Kunden registrieren
const RegisterIntoDatabaseHandler = async (req, res) => {
  let data = req.body;
  //Eintrag in die Datenbank
  try {
    //User wird in die DB eigetragen
    await RegisterToDatabase(data);
    //Status an axios senden
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
};

//Hier loggt sich der Kunde ein
const LoginHandler = async (req, res) => {
  const data = req.body;

  //Sucht Kunden in der Datenbank und gibt ihn zurück
  let returnedKunde = await Login(data);

  //Wenn keine User gefunden wurde nix schicken
  if (returnedKunde == 'no User found') {
    //Wenn kein User gefunden
    res.status(404).send('Kein Kunde');
  }
  //Wenn Kunde gefunden
  else {
    //Schauen ob Kunde ein Admin ist
    if (returnedKunde.isadmin) {
      //Code generieren
      let code = await SendAuthCode(returnedKunde.email, true);
      //Code per Mail senden
      SendAuthCodePerMail(code, returnedKunde.email);
      //Axios status setzen + Code und gefundenen User zurückgeben
      res.status(200).send(JSON.stringify({ foundUser: returnedKunde, code: code }));
    }
    //Wenn Kunde kein Admin ist
    else {
      //Axios status setzen + Code und gefundenen User zurückgeben
      res.status(200).send(JSON.stringify({ foundUser: returnedKunde, code: 'kein Admin' }));
    }
  }
};

//User loggt sich aus
const LogoutHandler = (req, res) => {
  req.session.destroy();
  res.clearCookie('comingHomeSave');
  res.end();
};

//Hier bekommt man alle User
const getUsersHandler = async (req, res) => {
  const erg = await getUsersfromDB();

  if (erg != 'no users') res.status(200).json(erg);
  else res.status(404).send('Es wurden keine user gefunden');
};

//Hier kann man übers Adminpanel den Adminstatus ändern
const PatchAdminHandler = async (req, res) => {
  const value = req.body;
  const id = req.params.id;

  await changeAdmin(value, id);
};

//User kann sein Passwort wechseln
const ChangePasswortHandler = async (req, res) => {
  //Variablen bekommen
  const { email } = req.params;
  const { newPw } = req.body;

  //Passwort ändern
  let erfolgreichGeändert = await ChangeUserPassword(email, newPw);
  if (erfolgreichGeändert == true) {
    res.status(200).send('Passwort erfolgreich geändert :)');
  } else {
    res.status(210).send('Es ist ein Fehler beim Ändern des Passwortest vorgefallen :(');
  }
};

module.exports = {
  SendAuthCodeHandler,
  RegisterIntoDatabaseHandler,
  LoginHandler,
  LogoutHandler,
  getUsersHandler,
  PatchAdminHandler,
  ChangePasswortHandler,
};
