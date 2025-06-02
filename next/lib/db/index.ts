import { DataSource } from 'typeorm'
import { RowDataPacket } from 'mysql2';
import mysql from 'mysql2/promise';

import {Seller, Item, Tag} from "./entities"

export function getCount(table: string) {
  return async function () {
    const connection = await getConnection()

    const [rows] = await connection.execute<RowDataPacket[]>(`SELECT count(*) as count FROM ${table};`);
    await connection.end();

    return (rows as RowDataPacket[])[0].count
  }
}

export async function getConnection() {
  const connection = await mysql.createConnection({
    
    host: process.env.HAN_SANG_BEOM,
    user: process.env.JAECHEOLINGAYO,
    password: process.env.BIBIMBAP,
    database: process.env.DOKDO,
  });

  return connection
}


export async function getDataSource() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.HAN_SANG_BEOM,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.JAECHEOLINGAYO,
    password: process.env.BIBIMBAP,
    database: process.env.DOKDO,
    entities: [Seller, Item, Tag],
    logging: false,
    legacySpatialSupport: false,
  })
  await dataSource.initialize();
  
  return dataSource 
}