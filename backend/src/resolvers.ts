import { Resolvers} from "./types";
import { LiftResolver } from "./resolvers/liftResolver";

export const resolvers: Resolvers = {
    Query: {
        // resolvers have 4 parameters: 
        // 1. parent: returned value of the resolver for this field's parent (??)
        // 2. args: all the arguments provided for that field 
        // 3. contextValue: object shared across ALL resolvers (like auth, database connection)
        // 4. info: info about the operations' execution state. not used often  

        getMoveMetadata: (_, __, { dataSources }) => {
            return dataSources.db.getMoveMetadata()
        }, // matches the structure of the schema type Query in schema.graphql 
        
        getMoveMetadataUsingId: (_, { id }, { dataSources}) => {
            return dataSources.db.getMoveUsingId(id)
        },

        getLifts: (_, __, { dataSources}) => {
            return dataSources.db.getLifts()
        },

        getLiftUsingId: (_, {id }, { dataSources}) => {
            return dataSources.db.getLiftUsingId(id)
        },

        getSetsForLiftAndMove: (_, { liftId, moveMetadataId}) => {
            const liftResolver = new LiftResolver(liftId)
            return liftResolver.getSetsForMove(moveMetadataId)
        }

    },
    Lift: {
        moves: ({id: liftId }, _, { dataSources}) => {
            return dataSources.db.getMoveMetadataForLiftId(liftId)
        }
    },
    LiftSet: {
        move_metadata: ({move_metadata_id}, _, { dataSources}) => {
            return dataSources.db.getMoveUsingId(move_metadata_id)
        },
    },
    // Listing is from the type definition of Listing 
    // It comes from export type Listing
    // which is defined in schema.graphql 
    // Listing: {
    //     amenities: ({id, amenities}, _, {dataSources}) => {
    //         return validateFullAmenities(amenities) ? amenities : dataSources.listingAPI.getAmenities(id)
    //     }
    // },
    Mutation: {
        createMoveMetadata: async (_, { input }, {dataSources}) => {
            try {
            const existingMove = await dataSources.db.getMoveUsingName(input.name)
            if (existingMove) {
                return {
                    code: 200,
                    success: true,
                    message: `Move already exists`,
                    moveMetadata: existingMove
                }
            }    

            const response = await dataSources.db.createMove(input)
            return {
                code: 200,
                success: true,
                message: "Move successfully created",
                moveMetadata: response,
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: JSON.stringify(error),
                moveMetadata: null
            }
        }
        },
        createLift: async(_, { input }, {dataSources}) => {
            try {
                const lift = await LiftResolver.createLift(input)
                return {
                    success: true,
                    code: 200,
                    message: "Lift successfully created",
                    lift
                }
            } catch (error) {
                return { 
                    success: false,
                    code: 500,
                    message: `Something went wrong ${error.message}`,
                    lift: null
                }
            }
        },
        addMoveToLift: async(_, { input}, {dataSources}) => {
            const liftResolver = new LiftResolver(input.lift_id)
            try {
                await liftResolver.addMoveToLift(input.move_metadata_id)
                return {
                    code: 200,
                    success: true,
                    message: `Successfully added move to lift and created set`
                }
            } catch (error) {
                return {
                    code: 500,
                    success: false, 
                    message: `Failed to add move to lift ${error.message}`
                }
            }
        },
        addSetForMove: async(_, { input }, { dataSources}) => {
            const liftResolver = new LiftResolver(input.lift_id)
            try {
                const newSet = await liftResolver.addSetForMove(input)
                return { 
                    success: true,
                    code: 200,
                    message: `Successfully added set ${newSet.set_count}`,
                    set: newSet
                }
            } catch (error) {
                return {
                    success: false, 
                    code: 500,
                    message: `Failed to add set with error ${error.message}`
                }
            }
        }
    }
}