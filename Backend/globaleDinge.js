const { Pool, Client } = require('pg');

//Account
const credentials = {
  user: 'postgres',
  host: 'localhost',
  database: 'cominghomesafe',
  password: 'postgres',
  port: 5432,
};

//Wichtige Variablen
let aktiverClient;

//Verbinden
function DatenbankVerbinden() {
  aktiverClient = new Pool(credentials);
  aktiverClient.connect();
}

//Trennen
function DatenbankTrennen() {
  aktiverClient.end();
}

//-----------------------------

//Testselect
async function testSelect() {
  DatenbankVerbinden();

  await aktiverClient.query('SELECT * FROM kunde;', (err, res) => {
    if (!err) {
      console.log(res.rows[0]);
    } else {
      console.log(err);
    }
  });

  DatenbankTrennen();
}

async function testSelectMitVariablen() {
  DatenbankVerbinden();

  await aktiverClient.query('SELECT * FROM kunde WHERE k_id = $1;', [1], (err, res) => {
    if (!err) {
      console.log(res.rows[0]);
    } else {
      console.log(err);
    }
  });

  DatenbankTrennen();
}

//Exporte
module.exports = {
  testSelect,
  testSelectMitVariablen,
};
