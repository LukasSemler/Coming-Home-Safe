import { query, pool } from '../DB/indexDB.js';

const checkIfUserExists = async (email) => {
  const { rows } = await query('SELECT * FROM kunde WHERE email = $1', [email]);

  if (rows[0]) return true;
  return false;
};

const registerUser = async (user) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `insert into kunde (vorname, nachname, email, passwort, strasse, ort, plz, hobbysinteressen, geburtsdatum, isadmin,
                   suser)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *;`,
      [
        user.vorname,
        user.nachname,
        user.email,
        user.passwort,
        user.strasse,
        user.ort,
        user.plz,
        user.hobbysinteressen,
        user.geburtsdatum,
        false,
        false,
      ],
    );

    await client.query(
      'INSERT INTO coordinates (lat, lng, uhrzeit, fk_kunde) values ($1, $2, $3, $4)',
      [null, null, null, rows[0].k_id],
    );

    await client.query('COMMIT');

    return rows;
  } catch (error) {
    await client.query('ROLLBACK');
    console.log('Fehler beim Registrieren');
    throw error;
  } finally {
    client.release();
  }
};

const loginUser = async (email, password) => {
  const { rows } = await query('SELECT * FROM kunde WHERE email = $1', [email]);

  if (rows[0].passwort == password) return rows[0];

  return false;
};

const changePasswordDB = async (email, password) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query('SELECT * FROM kunde WHERE email = $1', [email]);

    if (!rows[0]) false;

    const { rows: change } = await client.query(
      'UPDATE kunde SET passwort = $1 where email= $2 returning *; ',
      [password, email],
    );

    await client.query('COMMIT');
    return change[0];
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    client.release();
  }
};

async function sendPositionDB(position) {
  console.log(position);
  DatenbankVerbinden();

  const { rows } = await aktiverClient.query(
    'UPDATE coordinates SET lat = $1, lng = $2, uhrzeit = $3, fk_kunde = $4;',
    [position.lat, position.lng, position.dateTime, position.user.k_id],
  );
}

export { checkIfUserExists, registerUser, loginUser, changePasswordDB, sendPositionDB };
