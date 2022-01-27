const express = require('express');
const router = express.Router();


const {register} = require('../controllers/users')

router.get('/', (req, res) => res.send('Das ist ein Test'));
router.post('/register', register)

module.exports = router;
