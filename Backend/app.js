const express = require('express');
const morgan = require('morgan');
// const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/index');
const expressSession = require('express-session');

require('dotenv').config();

//Express app
const app = express();

app.use(morgan('dev'));
// app.use(helmet());
app.use(express.json());
//Cors chillt in der Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Express-Session
//Session benennen
// app.use(
// 	expressSession({
// 		secret: '',
// 		name: '',
// 		saveUninitialized: false,
// 		resave: false,
// 		cookie: {
// 			maxAge: 2 * 1000 * 60 * 60,
// 			httpOnly: false,
// 			sameSite: true,
// 		},
// 	}),
// );
//Routen
app.use('/', routes);

//Port
const PORT = process.env.PORT || 2410;
app.listen(PORT, () => {
	console.log(`Nodebackend-Server hört auf Port: ${PORT}`);
});
