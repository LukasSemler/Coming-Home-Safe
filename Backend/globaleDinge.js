const { Pool, Client } = require('pg');
const bcrypt = require('bcrypt');

//Account
const credentials = {
  user: 'postgres',
  host: 'localhost',
  database: 'cominghomesafe',
  password: 'postgres',
  port: 5432,
};

//Wichtige Variablen
let aktiverClient;

//Verbinden

//------------Offizielle Funktionen-----------------
function DatenbankVerbinden() {
  aktiverClient = new Pool(credentials);
  aktiverClient.connect();
}

//Trennen
function DatenbankTrennen() {
  aktiverClient.end();
}

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
async function SendAuthCode({ email }) {
  //Datenbankverbindung aufbauen
  DatenbankVerbinden();

  //Prüfen ob Kunde schon vorhanden
  let res = await aktiverClient.query('SELECT * FROM kunde WHERE email = $1', [email]);
  //Wenn Kunde noch nicht vorhanden
  if (!res.rows[0]) {
    //Email mit dem Code senden
    // SendAuthCodePerMail()

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
  
}

//Exporte
module.exports = {
  SendAuthCode,
  RegisterToDatabase,
};
