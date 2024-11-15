import { pool } from '../helpers/db.js';

const getAll = async () => {
    return await pool.query('select * from account');
}

export { getAll };