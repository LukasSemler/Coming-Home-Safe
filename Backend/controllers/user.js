import { checkIfUserExists, registerUser, loginUser } from '../Models/user.js';
import validator from 'is-my-json-valid';
import sendCode from '../Mail/mail.js';

const validateUser = validator({
  required: true,
  type: 'object',
  properties: {
    vorname: {
      required: true,
      type: 'string',
    },
    nachname: {
      required: true,
      type: 'string',
    },
    email: {
      required: true,
      type: 'string',
    },
    passwort: {
      required: true,
      type: 'string',
    },
    strasse: {
      required: true,
      type: 'string',
    },
    plz: {
      required: true,
      type: 'string',
    },
    ort: {
      required: true,
      type: 'string',
    },
    hobbysinteressen: {
      require: true,
      type: 'string',
    },
    geburtsdatum: {
      require: true,
      type: 'string',
    },
  },
});

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

const getCode = async (req, res) => {
  const { email, name } = req.body;

  //Schauen ob der User schon in der DB vorhanden ist
  const vorhanden = await checkIfUserExists(email);

  // Wenn der User schon vorhanden ist 400 zurückschicken
  if (vorhanden) return res.status(400).send('Der User ist bereits vorhanden');

  // Code generieren
  const code = makeAuthCode();

  //Code an den User schicken
  sendCode(code, email, name, res);
};

const register = async (req, res) => {
  if (!validateUser(req.body)) return res.status(400).send(validateUser.error);

  const result = await registerUser(req.body);

  if (!result) return res.status(500).send('Fehler beim Registrieren');

  return res.status(200).json(result);
};

const login = async (req, res) => {
  console.log(req.body);
  const { email, passwort } = req.body;

  const result = await loginUser(email, passwort);

  //Schauen ob der User ein Admin ist, wenn ja Mail schicken, sonst normal anmelden
  if (result.isAdmin) {
    const code = makeAuthCode();
    return sendCode(code, email, `${result.vorname} ${result.nachname}`, code, res, result);
  } else if (!result.isAdmin)
    return res.status(200).send(JSON.stringify({ foundUser: result, code: 'kein Admin' }));

  return res.status(500).send('Fehler beim Login');
};

export { getCode, register, login };
