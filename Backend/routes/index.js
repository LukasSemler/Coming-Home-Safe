//Required Dinge
const express = require('express');
const { SendAuthCodeHandler, RegisterIntoDatabase } = require('../controllers/Kunde');

//Router & Express-App
const router = express.Router();

//Routen
router.get('/', (req, res) => res.status(200).send('MainSeite!'));
//Kundenrouten
router.post('/registerGetAuth', SendAuthCodeHandler);
router.post('/registerToDb', RegisterIntoDatabase);

//Export
module.exports = router;
