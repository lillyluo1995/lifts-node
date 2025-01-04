import { Pool } from 'pg';
import { Move, CreateMoveMetadataResponse, CreateMoveMetadataInput, MoveMetadata, TargetType, Lift, LiftSet } from "../types";

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

    async getMoveUsingId(id: string): Promise<MoveMetadata | null> {
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

    async addSetOfMoveForLift(input: { moveMetadataId: string, liftId: string}): Promise<LiftSet> {

        const client = await this.pool.connect();

        await client.query("BEGIN");

        const lastSetResponse = await client.query<LiftSet>(`
            SELECT *
            FROM SET 
            WHERE LIFT_ID = ${input.liftId} AND MOVE_METADATA_ID = ${input.moveMetadataId}
            ORDER BY SET_INCREMENT DESC
            LIMIT 1    
        `)
        const lastSet = lastSetResponse.rows?.[0] ?? null 

        const newSetIncrement = lastSet ? lastSet.set_count + 1 : 1

        const response = await this.pool.query(`
            INSERT INTO SET 
            (move_metadata_id, lift_id, set_increment)
            VALUES ($1, $2, $3) 
            RETURNING *
            `, 
            [
                input.moveMetadataId, 
                input.liftId, 
                newSetIncrement
            ]
        )
        
        const newSet = response.rows[0]
        await client.query("COMMIT")
        return newSet
    }

    async getSetsForLiftIdAndMoveMetadataId(input: { liftId: string, moveMetadataId: string}): Promise<LiftSet[]> {
        const response = await this.pool.query<LiftSet>(`
            SELECT *
            FROM SET 
            WHERE LIFT_ID=${input.liftId} AND MOVE_METADATA_ID=${input.moveMetadataId}
            `)
        return response.rows
    }
}
