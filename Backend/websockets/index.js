const Websocket = require('ws');
const url = require('url');

//WebsocketVariablen
connections = [];

function wsServer(httpServer) {
  const wss = new Websocket.Server({ server: httpServer });
  wss.on('connection', (ws) => {
    let email = ws._protocol;
    email = email.replace('|', '@');

    connections.push({ ws, email });
    console.log(connections);
    console.log(connections.length);

    //Wenn der WebsocketServer Nachrichten bekommt
    ws.on('message', (data) => {
      const bekommen = JSON.parse(data);
      console.log(bekommen);
      connections.forEach((elem) => elem.ws.send(JSON.stringify(bekommen)));
    });

    ws.on('close', () => {
      const leftUser = connections.find((elem) => elem.ws == ws);
      connections = connections.filter((elem) => elem.ws != ws);
      console.log('User left');
      connections.forEach((elem) =>
        elem.ws.send(JSON.stringify({ type: 'userLeft', payload: leftUser.email })),
      );
    });
  });
}

module.exports = { wsServer };
