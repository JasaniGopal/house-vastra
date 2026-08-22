const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const url = process.env.DATABASE_URL.replace('mysql://', '');
  const [userPass, hostPortDb] = url.split('@');
  const [user, password] = userPass.split(':');
  const [hostPort, dbNameParams] = hostPortDb.split('/');
  const [host, port] = hostPort.split(':');
  const [dbName] = dbNameParams.split('?');

  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password,
    database: dbName
  });

  const [rows] = await connection.execute('SELECT p.id, p.name, p.gender, c.name as categoryName FROM Product p JOIN Category c ON p.categoryId = c.id');
  console.table(rows);
  await connection.end();
}

main().catch(console.error);
