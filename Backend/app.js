import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import colors from 'colors';
import wsServer from './websockets/index.js';
import { ErrorHandler, NotFoundHandler } from './middleware/index.js';

import routes from './routes/index.js';

dotenv.config();

const dirname = path.resolve();
const app = express();

app.use(morgan('dev'));
// app.use(helmet());
app.use(express.json());
app.use(cors());

//Statische Route
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(dirname, '/public')));

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

app.use(ErrorHandler);
app.use(NotFoundHandler);

const PORT = process.env.PORT || 3000;

const httpServer = app.listen(PORT, () => {
  console.log(`|---------------------------------------|`.magenta);
  console.log(` Nodebackend-Server hört auf Port: `.rainbow, `${PORT}`.green);
  console.log(`|---------------------------------------|`.magenta);
});

//Websockets zuweisen
wsServer(httpServer);
