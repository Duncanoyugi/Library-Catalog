/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { createDatabasePool } from 'src/config/database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;

  async onModuleInit() {
    const pool = createDatabasePool();
    if (!(pool instanceof Pool)) {
      throw new Error('Failed to create a valid database pool');
    }
    this.pool = pool;
    await this.testConnection();
  }

  async onModuleDestroy() {
    if (this.pool) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await this.pool.end();
    }
  }

  private async testConnection(): Promise<void> {
    try {
      if (!this.pool || !(this.pool instanceof Pool)) {
        throw new Error('Database pool is not initialized');
      }
      const pool: Pool = this.pool;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const client = await pool.connect();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await client.query('SELECT 1');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.release();
      console.log('Database connection established succesfully');
    } catch (error) {
      console.error('Failed to connect to database', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    if (!this.pool || !(this.pool instanceof Pool)) {
      throw new Error('Database pool is not initialized');
    }
    if (!this.pool) {
      throw new Error('Database pool is not initialized');
    }
    if (!this.pool || !(this.pool instanceof Pool)) {
      throw new Error('Database pool is not initialized');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const client = await this.pool.connect();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const result = await client.query(text, params);
      return result;
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.release();
    }
  }

  getClient(): PoolClient {
    if (!this.pool || !(this.pool instanceof Pool)) {
      throw new Error('Database pool is not initialized');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.pool.connect();
  }

  releaseClient(client: PoolClient): void {
    if (!client || !(client instanceof PoolClient)) {
      throw new Error('Invalid database client');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    client.release();
  }
}
