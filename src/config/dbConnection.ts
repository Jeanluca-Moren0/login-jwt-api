import { Pool } from 'pg';
import { config } from 'dotenv';
config();

async function connection() {

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
  });
  
  const dbConnect = await pool.connect();
  console.log("Conexão no PostgreSQL!");

  const res = await dbConnect.query('SELECT NOW()')
  console.log(res.rows[0])
  dbConnect.release()

  return dbConnect
}




export default connection ;
