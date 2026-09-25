import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgre',
  password: process.env.DB_PASSWORD || 'daniel2025',
  database: process.env.DB_NAME || 'taskmanagerdb',
});

export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};

export async function initDatabase(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
  console.log('Base de datos inicializada: tabla "tasks" lista.');
}
