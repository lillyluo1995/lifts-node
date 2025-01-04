import { AddSetForMoveInput, Lift, TargetType, LiftSet } from '../types'
import { DatabaseAPI } from '../datasources/database-api'

export class LiftResolver {
    private liftId: string 
    private dataSources: DatabaseAPI
    constructor(
        liftId: string
    ) {
        this.liftId = liftId 
        this.dataSources = new DatabaseAPI()
    }

    public static createLift(input: { date?: Date, target_type: TargetType}): Promise<Lift> {
        let { date, target_type } = input 
        if (!date) {
            date = new Date()
        }

        const databaseAPI = new DatabaseAPI()
        return databaseAPI.createLift({date, target_type})
    }

    public async addMoveToLift(moveMetadataId: string): Promise<void> {
        await this.dataSources.addMoveToLift({moveMetadataId, liftId: this.liftId})
    }

    public async addSetForMove(input: AddSetForMoveInput): Promise<LiftSet> {
        return await this.dataSources.addSetOfMoveForLift({moveMetadataId: input.move_metadata_id, liftId: this.liftId})
    }

    public async getSetsForMove(move_metadata_id: string): Promise<LiftSet[]> {
        return await this.dataSources.getSetsForLiftIdAndMoveMetadataId({liftId: this.liftId, moveMetadataId: move_metadata_id})
    }

}