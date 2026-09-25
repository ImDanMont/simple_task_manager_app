import { Pool } from 'pg';
import { Task } from '../domain/Task';
import { TaskRepository } from '../domain/TaskRepository';

export class PostgresTaskRepository implements TaskRepository {
  constructor(private readonly pool: Pool) {}

  async getAll(): Promise<Task[]> {
    const query = `
      SELECT 
        id, 
        title, 
        description, 
        completed, 
        created_at AS "createdAt"
      FROM tasks
      ORDER BY created_at DESC;
    `;
    const result = await this.pool.query(query);
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      completed: Boolean(row.completed),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    }));
  }

  async getById(id: string): Promise<Task | null> {
    const query = `
      SELECT 
        id, 
        title, 
        description, 
        completed, 
        created_at AS "createdAt"
      FROM tasks
      WHERE id = $1;
    `;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      completed: Boolean(row.completed),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    };
  }

  async save(task: Task): Promise<Task> {
    const query = `
      INSERT INTO tasks (id, title, description, completed, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id, 
        title, 
        description, 
        completed, 
        created_at AS "createdAt";
    `;
    const result = await this.pool.query(query, [
      task.id,
      task.title,
      task.description ?? null,
      task.completed,
      task.createdAt ?? new Date(),
    ]);
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      completed: Boolean(row.completed),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    };
  }

  async update(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updates.description || null);
    }
    if (updates.completed !== undefined) {
      fields.push(`completed = $${paramIndex++}`);
      values.push(updates.completed);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const query = `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id, 
        title, 
        description, 
        completed, 
        created_at AS "createdAt";
    `;
    const result = await this.pool.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      completed: Boolean(row.completed),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    };
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = $1;';
    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async toggleComplete(id: string): Promise<Task | null> {
    const query = `
      UPDATE tasks
      SET completed = NOT completed
      WHERE id = $1
      RETURNING 
        id, 
        title, 
        description, 
        completed, 
        created_at AS "createdAt";
    `;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      completed: Boolean(row.completed),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    };
  }
}
