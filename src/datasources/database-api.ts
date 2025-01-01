import { Pool } from 'pg';
import { Move, CreateMoveMetadataResponse, CreateMoveMetadataInput, MoveMetadata, TargetType, Lift } from "../types";

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
        const results = await this.pool.query<MoveMetadata>('SELECT * FROM MOVE_METADATA')
        return results.rows;
    }

    async getMoveUsingId(id: number): Promise<MoveMetadata | null> {
        const results = await this.pool.query<MoveMetadata>(`SELECT * FROM MOVE_METADATA WHERE ID = ${id}`)
        if (results.rowCount == 0) {
            return null
        }

        return results.rows[0]
    }

    async getMoveUsingName(name: string): Promise<MoveMetadata | null> {
        const results = await this.pool.query<MoveMetadata>(`SELECT * FROM MOVE_METADATA WHERE NAME = '${name}'`)
        if (results.rowCount == 0) {
            return null
        }
        return results.rows[0]
    }

    async createMove(metadata: CreateMoveMetadataInput): Promise<MoveMetadata> {
        const { name, target_muscle } = metadata;
        const response = await this.pool.query<MoveMetadata>(`INSERT INTO MOVE_METADATA (name, target_muscle) values ($1, $2) RETURNING *`, [name, target_muscle]);
        return response.rows[0]
    }

    async createLift(metadata: { date: Date, target_type: TargetType}): Promise<Lift> {
        const { date, target_type } = metadata 
        const response = await this.pool.query<Lift>(`INSERT INTO LIFT (date, target_type) values ($1, $2) RETURNING *`, [date, target_type]);
        return response.rows[0]
    }

    async getLifts(): Promise<Lift[]> {
        const response = await this.pool.query<Lift>(`SELECT * FROM LIFT`)
        return response.rows
    }

    async getLiftUsingId(id: number): Promise<Lift | null> {
        const response = await this.pool.query<Lift>(`SELECT * FROM LIFT WHERE ID = ${id}`)
        if (response.rowCount == 0) {
            return null
        }
        return response.rows[0]
    }

    async getMoveMetadataForLiftId(liftId: string): Promise<MoveMetadata[]> {
        const response = await this.pool.query<MoveMetadata>(
        `
            SELECT MOVE_METADATA.* FROM MOVE 
            INNER JOIN MOVE_METADATA
            ON MOVE.MOVE_METADATA_ID = MOVE_METADATA.ID
            WHERE LIFT_ID = ${liftId}
        `)
        return response.rows
    }

    async addMoveToLift(input: { moveMetadataId: string, liftId: string}): Promise<void> {
        await this.pool.query(`INSERT INTO MOVE (move_metadata_id, lift_id) values ($1, $2)`, [ input.moveMetadataId, input.liftId])
    }
}
