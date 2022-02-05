//Importe
require('dotenv').config();
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

//Account
const psqlCredentials = {
	user: 'postgres',
	host: 'localhost',
	database: 'cominghomesafe',
	password: 'postgres',
	port: 5432,
};

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

//#endregion

//#region -----------Offizielle Funktionen-----------

//Datenbankverbindung herstellen
function DatenbankVerbinden() {
	aktiverClient = new Pool(psqlCredentials);
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
async function SendAuthCode(email) {
	//Datenbankverbindung aufbauen
	DatenbankVerbinden();

	//Prüfen ob Kunde schon vorhanden
	let res = await aktiverClient.query('SELECT * FROM kunde WHERE email = $1', [email]);
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
	console.log(gefundenenKunde);

	if (gefundenenKunde) {
		if (gefundenenKunde.isadmin == true) {
			//Send Code
			console.log('Send code to Admin');
			const code = makeAuthCode();
			console.log(`Send Code: ${code}`);
			//Send mail to user
			SendAuthCodePerMail(
				code,
				gefundenenKunde.email,
				`${gefundenenKunde.vorname} ${gefundenenKunde.nachname}`,
			);
			return { status: 'adminLogin', payload: code };
		} else {
			//Datenbankverbindung trennen
			DatenbankTrennen();
			return gefundenenKunde;
		}
	} else {
		//Datenbankverbindung trennen
		DatenbankTrennen();
		return { status: 'Kein Kunde' };
	}
}

//#endregion

//Exporte
module.exports = {
	SendAuthCode,
	RegisterToDatabase,
	SendAuthCodePerMail,
	Login,
};
