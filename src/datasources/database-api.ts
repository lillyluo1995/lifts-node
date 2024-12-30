import { Pool } from 'pg';
import { MoveMetadata } from "../types";

export class DatabaseAPI {
    private pool: Pool

    constructor() {
        const pool = new Pool({
            host: "localhost",
            port: 5432,
            user: "postgres",
            database: "lifts",
            password: "lilly"
        })
        this.pool = pool 
    }

    async getMoveMetadata(): Promise<MoveMetadata[]> {
        const results = await this.pool.query('SELECT * FROM MOVE_METADATA')
        return results.rows;
    }
}
