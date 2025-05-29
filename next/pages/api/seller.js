import mysql from 'mysql2/promise';


export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: process.env.HAN_SANG_BEOM,
    user: process.env.JAECHEOLINGAYO,
    password: process.env.BIBIMBAP,
    database: process.env.DOKDO,
  });

  const [rows] = await connection.execute('SELECT * FROM NR_seller a LIMIT 10');

  await connection.end();

  res.status(200).json({sellers : rows});
}
