import { pool } from '../helpers/db.js'

 const insertUser = async (sid) => {
    return await pool.query('insert into account (sid) values ($1) returning *',[sid])
 }
 
 const selectUserBySid = async (sid) => {
    return await pool.query('select * from account where sid=$1', [sid])
 }

 export { insertUser, selectUserBySid }