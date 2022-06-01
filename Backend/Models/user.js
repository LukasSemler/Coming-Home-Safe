import { query } from '../DB/indexDB.js';

const checkIfUserExists = async (email) => {
  const { rows } = await query('SELECT * FROM kunde WHERE email = $1', [email]);

  if (rows[0]) return true;
  return false;
};

export { checkIfUserExists };
