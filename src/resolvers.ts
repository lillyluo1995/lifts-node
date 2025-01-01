import { Resolvers} from "./types";

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
        }
    },
    Lift: {
        // TODO: did i design the DB poorly? i have to make another db call to get the move metadata? 
        // maybe better to stick the move ids onto the lift? 
        moves: ({id: liftId }, _, { dataSources}) => {
            return dataSources.db.getMoveMetadataForLiftId(liftId)
        }
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
            let { date, target_type } = input 
            if (!date) {
                date = new Date()
            }

            try {
                const lift = await dataSources.db.createLift({date, target_type})
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
            const {move_metadata_id: moveMetadataId, lift_id: liftId} = input 
            try {
                await dataSources.db.addMoveToLift({moveMetadataId, liftId})
                return {
                    code: 200,
                    success: true,
                    message: `Successfully added move to lift`
                }
            } catch (error) {
                return {
                    code: 500,
                    success: false, 
                    message: `Failed to add move to lift ${error.message}`
                }
            }
        }
    }
}