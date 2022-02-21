//Importe
require('dotenv').config();
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { google } = require('googleapis');
const { checkPrimeSync } = require('crypto');
const OAuth2 = google.auth.OAuth2;

//#region -----------WICHTIGE VARIABLEN-----------

let aktiverClient;

//GoogleService für Email
const oauth2Client = new OAuth2(
  process.env.CLIENTID,
  process.env.CLIENTSECRET,
  'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'comingHomeSafe.HTLWW@gmail.com',
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//DB-Account brauchen wir nur noch für Datagrip
// const psqlCredentials = {
//   user: 'vawourouomrsit',
//   host: 'ec2-18-203-64-130.eu-west-1.compute.amazonaws.com',
//   database: 'ddphhp999e8mja',
//   password: 'a385457ff7597ae26f0fba6dc4c27be706398a8b14543889762d04137aeae620',
//   port: 5432,
// };
//#endregion

//#region -----------Offizielle Funktionen-----------
//Datenbankverbindung herstellen
function DatenbankVerbinden() {
  // //Development
  aktiverClient = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cominghomesafe',
    password: 'postgres',
    port: 5432,
  });

  //Production
  // aktiverClient = new Pool({
  //   connectionString: process.env.DATABASE_URL,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // });

  aktiverClient.connect();

  //Testquery-Pool
}

//Datenbankverbindung schließen
function DatenbankTrennen() {
  aktiverClient.end();
  aktiverClient = null;
}

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

//--------Register--------

//Authentifakationscode generieren & senden
async function SendAuthCode(email, fürLogin = false) {
  //Datenbankverbindung aufbauen
  DatenbankVerbinden();

  //Prüfen ob Kunde schon vorhanden
  let res = await aktiverClient.query('SELECT * FROM kunde WHERE email = $1', [email]);

  if (!fürLogin) {
    //Wenn Kunde noch nicht vorhanden
    if (!res.rows[0]) {
      //Datenbankverbindung trennen
      DatenbankTrennen();

      //Code zurückgeben
      return makeAuthCode();
    } else {
      //Datenbankverbindung trennen
      DatenbankTrennen();

      //Code zurückgeben
      return 'noUser';
    }
  } else {
    //Datenbankverbindung trennen
    DatenbankTrennen();
    //Code zurückgeben
    return makeAuthCode();
  }
}

async function SendAuthCodePerMail(genCode, empfängerMail, name) {
  //Nodemailer smtpTransport erstellen

  //Configure Handlebar ------> PFAD MACHT PROBLEME!!!!!
  const handlebarOptions = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.resolve(__dirname, 'controllers', 'templateViews'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./controllers/templateViews/'),
    extName: '.handlebars',
  };

  //smtpTransport soll Handlebars verwenden
  smtpTransport.use('compile', hbs(handlebarOptions));

  // Mail options
  let mailoptions = {
    from: 'comingHomeSafe.HTLWW@gmail.com',
    to: empfängerMail,
    // to: "benjamin.stauf11@gmail.com",
    subject: 'Verifizierung',
    //Einbindung von Handlebars
    template: 'authentification',
    context: {
      Name: name,
      Code: genCode,
    },
  };

  //Email senden
  smtpTransport.sendMail(mailoptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
}

//Registrieren
async function RegisterToDatabase({
  vorname,
  nachname,
  email,
  passwort,
  strasse,
  ort,
  plz,
  hobbysinteressen,
  geburtsdatum,
}) {
  //Datenbankverbindung aufbauen
  DatenbankVerbinden();

  //Kunde in DB eintragen
  await aktiverClient.query(
    'INSERT INTO kunde (vorname, nachname, email, passwort, strasse, ort, plz, hobbysinteressen, geburtsdatum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [vorname, nachname, email, passwort, strasse, ort, plz, hobbysinteressen, geburtsdatum],
    (err) => {
      if (err) console.log(err);
    },
  );

  //Datenbankverbindung trennen
  DatenbankTrennen();
}

//--------Login----------
async function Login({ email, passwort }) {
  //Datenbankverbindung herstellen
  DatenbankVerbinden();

  //Schauen ob Kunde existiert und gibt kunde zurück
  let { rows } = await aktiverClient.query(
    'SELECT * FROM kunde WHERE email = $1 AND passwort = $2',
    [email, passwort],
  );

  let gefundenenKunde = rows[0];

  if (gefundenenKunde) return gefundenenKunde;
  else return 'no User found';

  //ALT!!!!
  // if (gefundenenKunde) {
  //   if (gefundenenKunde.isadmin == true) {
  //     //Send Code
  //     console.log('Send code to Admin');
  //     const code = makeAuthCode();
  //     console.log(`Send Code: ${code}`);
  //     //Send mail to user
  //     SendAuthCodePerMail(
  //       code,
  //       gefundenenKunde.email,
  //       `${gefundenenKunde.vorname} ${gefundenenKunde.nachname}`,
  //     );
  //     return { status: 'adminLogin', payload: code, kunde: gefundenenKunde };
  //   } else {
  //     //Datenbankverbindung trennen
  //     DatenbankTrennen();
  //     return gefundenenKunde;
  //   }
  // } else {
  //   //Datenbankverbindung trennen
  //   DatenbankTrennen();
  //   return { status: 'Kein Kunde' };
  // }
}

//#endregion

//Hier bekommt man alle User
async function getUsersfromDB() {
  let res;
  //Datenbankverbindung herstellen
  DatenbankVerbinden();

  //Holt alle Kunden
  let { rows } = await aktiverClient.query('SELECT * FROM kunde');
  console.log(rows);

  if (rows) {
    res = rows;
  } else {
    res = 'no users';
  }
  //Datenbankverbindung trennen
  DatenbankTrennen();

  return res;
}

//Hier wird der isAdmin-Wert eines Users geändert (über Adminpanel)
async function changeAdmin({ value }, id) {
  //Datenbankverbindung Herstellen
  DatenbankVerbinden();

  await aktiverClient.query(
    'UPDATE kunde set isadmin = $1 WHERE k_id = $2;',
    [value, id],
    (err) => {
      if (err) console.log(err);
    },
  );

  //Datenbankverbindung trennen
  DatenbankTrennen();
}

//Exporte
module.exports = {
  SendAuthCode,
  RegisterToDatabase,
  SendAuthCodePerMail,
  Login,
  getUsersfromDB,
  changeAdmin,
};
