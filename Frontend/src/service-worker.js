//Wichtige Imports oder Variablen

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
workbox.core.setCacheNameDetails({ prefix: 'coming-home-safe' });

//Variablen
let ws = null;
let intervall = null;

//Auf Messages reagieren
self.addEventListener('message', (event) => {
  //Beim Installieren Wartezeit Skippen
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  //Messanges
  const { type, payload } = JSON.parse(event.data);

  switch (type) {
    case 'connect':
      let { email, wsAdresse } = payload;

      email = email.replace('@', '|');
      //Verbindung herstellen
      ws = new WebSocket(wsAdresse, email);

      //TODO TESTMESSAGE AN DEN CLIENT
      event.source.postMessage(
        JSON.stringify({
          type: 'testMessage',
          payload: 'Der Connect mit dem WebSocket hat problemlos funktioniert ;)',
        }),
      );
      break;

    case 'startTracking':
      console.log('startTracking...');

      //Trackintervall Starten
      intervall = setInterval(track, 3500);

      break;

    case 'stopTracking':
      console.log('stopTracking...');

      //Trackintervall anhalten
      clearInterval(intervall);
      intervall = null;

      break;

    case 'disconnect':
      console.log('Disconnect');
      ws.close();

      //Intervall ausmachen, falls läuft
      if (intervall != null) {
        clearInterval(intervall);
        intervall = null;
      }
      break;
  }
});

//---Funktionen---

//Funktion ruft aktuelle Standortkoordinaten auf

async function track() {
  console.log('TRACK!!!');

  //TODO FUNKTIONIERT NICHT, DA SERVICEWORKER KEINEN ZUGRIFF HAT AUF MEINEN STANDORT.
  // if (navigator.geolocation) {
  //   //Function gibt aktuelle Coordinaten zurück
  //   let getCoordinates = () =>
  //     new Promise(function (resolve, reject) {
  //       navigator.geolocation.getCurrentPosition(resolve, reject);
  //     });

  //   //Aktuelle Standortkoordinaten abfragen
  //   let {
  //     coords: { latitude: lat, longitude: lng },
  //   } = await getCoordinates();

  //   //User aktuellen Standort schicken
  //   console.log(`Standort: LAT: ${lat} LNG: ${lng}`);
  // } else {
  //   console.log('Geolocation is aus');
  // }
}

//Precache
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
