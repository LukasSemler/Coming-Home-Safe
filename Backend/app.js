const express = require('express');
const morgan = require('morgan');
// const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/index');
const expressSession = require('express-session');
const colors = require("colors")
let { wsServer } = require('./websockets');

require('dotenv').config();

//Express app
const app = express();

app.use(morgan('dev'));
// app.use(helmet());
app.use(express.json());
//Cors chillt in der Middleware
app.use(cors());
//Statische Route
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Express-Session
//Session benennen
app.use(
  expressSession({
    secret: 'comingHomeSave',
    name: 'comingHomeSave',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 2 * 1000 * 60 * 60,
      httpOnly: false,
      sameSite: true,
    },
  }),
);
//Routen
app.use('/', routes);

//Port
const PORT = process.env.PORT || 3000;

const httpServer = app.listen(PORT, () => {
  // console.clear();
  console.log(`|---------------------------------------|`.magenta);
  console.log(` Nodebackend-Server hört auf Port: `.rainbow, `${PORT}`.green);
  console.log(`|---------------------------------------|`.magenta);
});

//Websockets zuweisen
wsServer(httpServer);
