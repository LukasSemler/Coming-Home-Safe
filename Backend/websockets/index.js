const Websocket = require('ws');

connections = [];
function wsServer(httpServer) {
  const wss = new Websocket.Server({ server: httpServer });
  wss.on('connection', (ws) => {
    // console.log('A new Connection');
    connections.push(ws);
    console.log(connections.length);

    ws.on('message', (data) => {
      const bekommen = JSON.parse(data);
      bekommen.type = 'Coords';
      connections.forEach((elem) => elem.send(JSON.stringify(bekommen)));
    });

    ws.on('close', () => {
      connections = connections.filter((elem) => elem != ws);
      console.log(connections.length);
    });
  });
}

module.exports = { wsServer };
