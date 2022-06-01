import { checkIfUserExists } from '../Models/user.js';
import sendCode from '../Mail/mail.js';

//Generiert einen Authentifikations-Code
let makeAuthCode = () => {
  let code = '';
  let auswahl = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  //Auth-Code generieren wenn Kunde noch nicht vorhanden
  for (let index = 0; index < 5; index++) {
    let rand = Math.round(Math.random() * (auswahl.length - 0));
    code += auswahl[rand];
  }
  return code;
};

const register = async (req, res) => {
  const { email, name } = req.body;

  //Schauen ob der User schon in der DB vorhanden ist
  const vorhanden = await checkIfUserExists(email);

  // Wenn der User schon vorhanden ist 400 zurückschicken
  if (vorhanden) return res.status(400).send('Der User ist bereits vorhanden');

  // Code generieren
  const code = makeAuthCode();

  //Code an den User schicken
  const success = await sendCode(code, email, name);

  // Schauen ob das Senden von Code erfolgreich war
  if (success) return res.status(200).send(code);

  return res.status(500).send('Es ist ein Fehler beim Code senden aufgetreten');
};

export { register };
