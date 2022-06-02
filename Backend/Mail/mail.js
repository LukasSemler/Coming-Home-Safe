import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dirname = path.resolve();
const OAuth2 = google.auth.OAuth2;

//GoogleService für Email
const oauth2Client = new OAuth2(
  '468969490248-l3tl0rfuiuu0tdd4esdqeu6mk7rcbqdp.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
  refresh_token:
    '1//04yuaN3A5A2daCgYIARAAGAQSNwF-L9IrHjijfleRmiHlkhQtJ7WFxiA72fdE_U-71vRqx8VXe0x4-UzqbiqZ98WlSBceeQ28dtc',
});

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'benjamin.stauf11@gmail.com',
    clientId: '468969490248-l3tl0rfuiuu0tdd4esdqeu6mk7rcbqdp.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken:
      '1//04yuaN3A5A2daCgYIARAAGAQSNwF-L9IrHjijfleRmiHlkhQtJ7WFxiA72fdE_U-71vRqx8VXe0x4-UzqbiqZ98WlSBceeQ28dtc',
    accessToken: accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function SendAuthCodePerMail(genCode, empfängerMail, name, res) {
  //Nodemailer smtpTransport erstellen

  //Configure Handlebar ------> PFAD MACHT PROBLEME!!!!!
  const handlebarOptions = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.resolve(dirname, 'controllers', 'templateViews'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./controllers/templateViews/'),
    extName: '.handlebars',
  };

  //smtpTransport soll Handlebars verwenden
  smtpTransport.use('compile', hbs(handlebarOptions));

  // Mail options
  let mailoptions = {
    from: 'comingHomeSafe.HTLWW@gmail.com',
    to: empfängerMail,
    // to: "benjamin.stauf11@gmail.com",
    subject: 'Verifizierung',
    //Einbindung von Handlebars
    template: 'authentification',
    context: {
      Name: name,
      Code: genCode,
    },
  };

  //Email senden
  // smtpTransport.sendMail(mailoptions, (error, response) => {
  //   error ? console.log(error) : console.log(response);
  //   smtpTransport.close();
  // });

  smtpTransport.sendMail(mailoptions, (error, response) => {
    if (error) {
      console.log('Error beim Mail senden: ', error);
      smtpTransport.close();
      res.status(500).send('Error beim Mail senden: ', error);
    } else {
      console.log('Success beim Mail senden');
      smtpTransport.close();
      res.status(200).send(genCode);
    }
  });
}

export default SendAuthCodePerMail;
