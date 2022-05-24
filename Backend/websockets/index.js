const Websocket = require('ws');

//WebsocketVariablen
let connections = [];

function wsServer(httpServer) {
  const wss = new Websocket.Server({ server: httpServer });
  wss.on('connection', (ws) => {
    let email = ws._protocol;
    email = email.replace('|', '@');

    connections.push({ ws, email });

    //Wenn der WebsocketServer Nachrichten bekommt
    ws.on('message', (data) => {
      const { daten: positionData, type } = JSON.parse(data);

      console.log('TYPEEEEEE: ' + type);

      //Auf Nachrichten richtig Reagieren
      switch (type) {
        case 'sendPosition':
          console.log(`Nachrichtentyp: ${type} --> IM CASE`);

          connections.forEach((elem) =>
            elem.ws.send(JSON.stringify({ type: 'getPosition', data: positionData })),
          );
          break;
        default:
          console.log(`Nachrichtentyp: ${type} nicht defined (SWITCH IN websocket)`);
          break;
      }
    });

    //Wenn sich der User vom Websocket trennt
    ws.on('close', () => {
      console.log(`User: ${connections.find((elem) => elem.ws == ws).email} left`);

      connections = connections.filter((elem) => elem.ws != ws);

      connections.forEach((elem) =>
        elem.ws.send(
          JSON.stringify({
            type: 'userLeft',
            data: connections.find((elem) => elem.ws == ws).email,
          }),
        ),
      );
    });
  });
}

setInterval(() => {
  console.log('Länge: ' + connections.length);
}, 1000);

module.exports = { wsServer };
