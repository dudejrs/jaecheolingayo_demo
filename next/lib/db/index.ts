import { RowDataPacket } from 'mysql2';
import mysql from 'mysql2/promise';

export function getCount(table: string) {
  return async function () {
    const connection = await getConnection()

    const [rows] = await connection.execute<RowDataPacket[]>(`SELECT count(*) as count FROM ${table};`);
    await connection.end();

    return (rows as RowDataPacket[])[0].count
  }
}

export default async function getConnection() {
  const connection = await mysql.createConnection({
    
    host: process.env.HAN_SANG_BEOM,
    user: process.env.JAECHEOLINGAYO,
    password: process.env.BIBIMBAP,
    database: process.env.DOKDO,
  });

  return connection
}
