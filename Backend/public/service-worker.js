importScripts("/precache-manifest.dbd3b9518710e3989279d7121ae0adc2.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

//Wichtige Imports oder Variablen

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
workbox.core.setCacheNameDetails({ prefix: 'coming-home-safe' });

//Variablen
let ws = null;

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

    case 'position':
      console.log('get user position...');

      //Websocket daten schicken
      ws.send(JSON.stringify({ type: 'sendPosition', daten: payload }));

      break;

    case 'alarm':
      //TODO Alarm erstellen
      console.log('Alarm im ServiceWorker');

      //Daten an den Websocket schicken
      ws.send(JSON.stringify({ type: 'alarm', daten: payload }));
      break;

    case 'disconnect':
      console.log('Disconnect');
      ws.close();

      break;

    case 'newConnection':
      console.log('Neuer User');

      break;
  }
});

//---Funktionen---

//Precache
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

