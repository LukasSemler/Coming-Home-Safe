//Required Dinge
const express = require('express');

//Routenhandler
const { SendAuthCodeHandler, RegisterIntoDatabase, LoginHandler } = require('../controllers/Kunde');

//Router & Express-App
const router = express.Router();

//Routen
router.get('/', (req, res) => res.status(200).send('MainSeite!'));
//Kundenrouten
router.post('/registerGetAuth', SendAuthCodeHandler);
router.post('/registerToDb', RegisterIntoDatabase);
router.post('/login', LoginHandler);

//Export
module.exports = router;
