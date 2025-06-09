/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private pool!: Pool;

  constructor(private readonly configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const host: string | undefined = this.configService.get<string>('DB_HOST');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const port: string | undefined = this.configService.get<string>('DB_PORT');
    const user: string | undefined = this.configService.get<string>('DB_USER');
    const password: string | undefined =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.configService.get<string>('DB_PASSWORD');
    const database: string | undefined =
      this.configService.get<string>('DB_NAME');

    if (!host || !port || !user || !password || !database) {
      throw new Error('Database configuration variables are missing');
    }

    this.pool = new Pool({
      host: host,
      port: Number(port),
      user: user,
      password: password,
      database: database,
    });
  }

  async query(text: string, params?: any[]): Promise<any> {
    try {
      return await this.pool.query(text, params);
    } catch (error) {
      throw new Error(`Database query failed: ${(error as Error).message}`);
    }
  }
}
