const mysql = require("mysql2/promise");

let pool;

const DEFAULT_DB = "sql5808599";

function getConfig() {
  return {
    host: "sql5.freesqldatabase.com",
    port: 3306,
    user: "sql5808599",
    password: "AAtRHwaFbw",
    database: "sql5808599",
  };
}

async function initializeDatabase() {
  if (pool) {
    return pool;
  }

  const config = getConfig();

  try {
    // Ensure database exists before creating a pool that targets it
    const bootstrapConnection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });

    await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    await bootstrapConnection.end();

    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await createUsersTable();
    await createVolunteersTable();

    console.log(`Connected to MySQL and using database "${config.database}"`);

    return pool;
  } catch (error) {
    if (pool) {
      await pool.end();
      pool = null;
    }
    console.error("Database initialization failed:", error.message);
    throw error;
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return pool;
}

async function createUsersTable() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function createVolunteersTable() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      location VARCHAR(255),
      interests TEXT,
      experience TEXT,
      source VARCHAR(100) DEFAULT 'greenpeace',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

module.exports = {
  initializeDatabase,
  getPool,
};
