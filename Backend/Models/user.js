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

export { checkIfUserExists, registerUser, loginUser };
