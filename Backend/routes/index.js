//Required Dinge
const express = require('express');
const { registerHandler } = require('../controllers/Kunde');

//Router & Express-App
const router = express.Router();

//Routen
router.get('/', (req,res) => res.status(200).send("MainSeite!"));
router.get('/register', registerHandler);

//Export
module.exports = router;
