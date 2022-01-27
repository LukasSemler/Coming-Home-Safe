const Pool = require('pg').Pool;
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'cominghomesafe',
	password: 'postgres',
	port: 5432,
});

const register = (req, res) => {
	const bodyDaten = req;
	console.log(req.body.addresse);

	pool.query(
		'INSERT INTO kunde (vorname, nachname, email, passwort, strasse, ort, plz, hobbysinteressen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8); ',
		[
			bodyDaten.vorname,
			bodyDaten.nachname,
			bodyDaten.email,
			bodyDaten.passwort,
			req.body.addresse.Strasse,
			req.body.addresse.Ort,
			req.body.addresse.PLZ,
			bodyDaten.interessen,
		],
		(err, results) => {
			if (err) throw err;
			res.status(200).send('User erfolgreich geaddet');
		},
	);
};

module.exports = { register };
