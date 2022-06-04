//Required Dinge
import express from 'express';
import AsyncHandler from 'express-async-handler';

import { getCode, register, login, abmelden } from '../controllers/user.js';

//Routenhandler
// const {
//   SendAuthCodeHandler,
//   RegisterIntoDatabaseHandler,
//   LoginHandler,
//   LogoutHandler,
//   getUsersHandler,
//   PatchAdminHandler,
//   ChangePasswortHandler,
//   sendPosition,
// } = require('../controllers/Kunde');

//Router & Express-App
const router = express.Router();

//Routen
router.get('/', (req, res) => res.status(200).send('MainSeite!'));

//Kundenrouten
// router.post('/login', LoginHandler);
// router.get('/abmelden', LogoutHandler);

// router.get('/getUsers', getUsersHandler);
// router.patch('/patchAdmin/:id', PatchAdminHandler);
// router.patch('/changeUserPasword/:email', ChangePasswortHandler);

// router.post('/sendPosition', sendPosition);

// User Registrieren
router.post('/getCode', AsyncHandler(getCode));
router.post('/register', AsyncHandler(register));

router.post('/login', AsyncHandler(login));
router.get('/abmelden', AsyncHandler(abmelden));

//Export
export default router;
