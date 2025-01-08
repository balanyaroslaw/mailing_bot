import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
    private pool: Pool;
  
    public constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          });
  
      this.pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
      });
    }
  
    public async query<T extends QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>> {
      const client = await this.pool.connect();
      try {
        return await client.query<T>(text, params);
      } finally {
        client.release();
      }
    }
  
    public async close(): Promise<void> {
      await this.pool.end();
    }
  }