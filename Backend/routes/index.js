//Required Dinge
import express from 'express';
import AsyncHandler from 'express-async-handler';

import {
  getCode,
  register,
  login,
  abmelden,
  changePasswort,
  sendPosition,
} from '../controllers/user.js';

//Router & Express-App
const router = express.Router();

//Routen
router.get('/', (req, res) => res.status(200).send('Test!'));

//Kundenrouten

// router.get('/getUsers', getUsersHandler);
// router.patch('/patchAdmin/:id', PatchAdminHandler);

// User Registrieren
router.post('/getCode', AsyncHandler(getCode));
router.post('/register', AsyncHandler(register));

router.post('/login', AsyncHandler(login));
router.get('/abmelden', AsyncHandler(abmelden));

router.patch('/changeUserPassword/:email', AsyncHandler(changePasswort));

router.post('/sendPosition', AsyncHandler(sendPosition));

//Export
export default router;
