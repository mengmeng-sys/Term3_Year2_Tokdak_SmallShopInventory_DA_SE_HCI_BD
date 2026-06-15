const pool = require('../config/db')

const findByEmail = async (email) =>{
 const [rows] = await pool.query(
  'select * from users where email = ?',
  [email]);

 return rows[0];
}
module.exports = {
 findByEmail
};