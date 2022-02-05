//Required Dinge
const express = require('express');

//Routenhandler
const {
	SendAuthCodeHandler,
	RegisterIntoDatabase,
	LoginHandler,
	logout,
	getUsers,
  patchAdmin
} = require('../controllers/Kunde');

//Router & Express-App
const router = express.Router();

//Routen
router.get('/', (req, res) => res.status(200).send('MainSeite!'));
//Kundenrouten
router.post('/registerGetAuth', SendAuthCodeHandler);
router.post('/registerToDb', RegisterIntoDatabase);
router.post('/login', LoginHandler);
router.get('/abmelden', logout);

router.get('/getUsers', getUsers);
router.patch('/patchAdmin/:id', patchAdmin)

//Export
module.exports = router;
