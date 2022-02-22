const Websocket = require('ws');

//WebsocketVariablen
connections = [];

function wsServer(httpServer) {
  const wss = new Websocket.Server({ server: httpServer });
  wss.on('connection', (ws) => {
    connections.push(ws);
    console.log(connections.length);

    //Wenn der WebsocketServer Nachrichten bekommt
    ws.on('message', (data) => {
      const bekommen = JSON.parse(data);
      bekommen.type = 'Coords';
      connections.forEach((elem) => elem.send(JSON.stringify(bekommen)));
    });

    ws.on('close', () => {
      connections = connections.filter((elem) => elem != ws);
      console.log('User left');
      connections.forEach((elem) =>
        elem.send(JSON.stringify({ type: 'info', payload: 'User left' })),
      );
    });
  });
}

module.exports = { wsServer };
