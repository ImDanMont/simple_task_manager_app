"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
exports.initDatabase = initDatabase;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgre',
    password: process.env.DB_PASSWORD || 'daniel2025',
    database: process.env.DB_NAME || 'taskmanagerdb',
});
const query = (text, params) => {
    return exports.pool.query(text, params);
};
exports.query = query;
async function initDatabase() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await exports.pool.query(createTableQuery);
    console.log('Base de datos inicializada: tabla "tasks" lista.');
}
