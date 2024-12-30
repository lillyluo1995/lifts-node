import { Resolvers} from "./types";
import { validateFullAmenities } from "./helpers";

export const resolvers: Resolvers = {
    Query: {
        // resolvers have 4 parameters: 
        // 1. parent: returned value of the resolver for this field's parent (??)
        // 2. args: all the arguments provided for that field 
        // 3. contextValue: object shared across ALL resolvers (like auth, database connection)
        // 4. info: info about the operations' execution state. not used often  

        moves: (_, __, { dataSources }) => {
            return dataSources.db.getMoveMetadata()
        }, // matches the structure of the schema type Query in schema.graphql 
    },
    // Listing is from the type definition of Listing 
    // It comes from export type Listing
    // which is defined in schema.graphql 
    // Listing: {
    //     amenities: ({id, amenities}, _, {dataSources}) => {
    //         return validateFullAmenities(amenities) ? amenities : dataSources.listingAPI.getAmenities(id)
    //     }
    // },
    // Mutation: {
    //     createMoveMetadata: async (_, { input }, {dataSources}) => {
    //         try {
    //         const response = await dataSources.db.createListing(input)
    //         return {
    //             code: 200,
    //             success: true,
    //             message: "Move successfully created",
    //             listing: response,
    //         }
    //     } catch (error) {
    //         return {
    //             code: 500,
    //             success: false,
    //             message: JSON.stringify(error.extensions.response.body),
    //             listing: null
    //         }
    //     }
    //     }
    }