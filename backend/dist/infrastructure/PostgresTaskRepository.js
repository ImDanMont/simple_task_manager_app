"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresTaskRepository = void 0;
class PostgresTaskRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async getAll() {
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
    async getById(id) {
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
    async save(task) {
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
    async update(id, updates) {
        const fields = [];
        const values = [];
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
    async delete(id) {
        const query = 'DELETE FROM tasks WHERE id = $1;';
        const result = await this.pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
    async toggleComplete(id) {
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
exports.PostgresTaskRepository = PostgresTaskRepository;
