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
		res.status(404).send(err);
	}
};

const LoginHandler = (req, res) => {
	const data = req.body;
	Login(data).then((returnedKunde) => {
		if (returnedKunde.status != 'Kein Kunde') {
			res.status(200).json(returnedKunde);
		} else if (returnedKunde.status == 'adminLogin') {
			res.status(200).json(returnedKunde);
		} else {
			res.status(404).send('Kein Kunde');
		}
	});
};

const logout = (req, res) => {
	req.session.destroy();
	res.clearCookie('comingHomeSave');
	res.end();
};

module.exports = {
	SendAuthCodeHandler,
	RegisterIntoDatabase,
	LoginHandler,
	logout,
};
