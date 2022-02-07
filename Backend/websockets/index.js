const Websocket = require('ws');

connections = [];

function wsServer(httpServer) {
  const wss = new Websocket.Server({ server: httpServer });
  wss.on('connection', (ws) => {
    // console.log('A new Connection');
    console.log(connections.length);

    ws.onopen = (event) => {
      const { data } = JSON.parse(event);
      //Client in connections eintragen
      connections.push(ws);

      console.log(data);
    };

    ws.on('message', (data) => {
      const bekommen = JSON.parse(data);
      connections.forEach((elem) => elem.send(JSON.stringify(bekommen)));
    });

    //Wenn sich Client trennt
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
