//Required Dinge
const express = require('express');

//Routenhandler
const {
  SendAuthCodeHandler,
  RegisterIntoDatabaseHandler,
  LoginHandler,
  LogoutHandler,
  getUsersHandler,
  PatchAdminHandler,
  ChangePasswortHandler,
} = require('../controllers/Kunde');

//Router & Express-App
const router = express.Router();

//Routen
router.get('/', (req, res) => res.status(200).send('MainSeite!'));

//Kundenrouten
router.post('/registerGetAuth', SendAuthCodeHandler);
router.post('/registerToDb', RegisterIntoDatabaseHandler);
router.post('/login', LoginHandler);
router.get('/abmelden', LogoutHandler);

router.get('/getUsers', getUsersHandler);
router.patch('/patchAdmin/:id', PatchAdminHandler);
router.patch('/changeUserPasword/:email', ChangePasswortHandler);

//Export
module.exports = router;
