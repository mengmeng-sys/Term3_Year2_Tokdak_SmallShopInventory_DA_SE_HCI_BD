const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
    
});
// Test the connection
const testConnection= async ()=>{
  try {
    
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release(); // give the connection back to the pool
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}
const testConnection1 = async () => {
    try {
        const [rows] = await pool.query(
            'SELECT NOW() AS currentTime'
        );
        console.log(rows);
    } catch(err) {
        console.error(err);
    }
};

testConnection();
testConnection1();
console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool;
