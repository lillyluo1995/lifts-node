import { ApolloServer, BaseContext } from "@apollo/server";
import {startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { resolvers } from "./resolvers";
import { DatabaseAPI } from "./datasources/database-api";
import {mockResolvers} from "./mockResolvers";

const typeDefs = gql(
    readFileSync(path.resolve(__dirname, "./schema.graphql"), {
        encoding: "utf-8"
    })
)

async function startApolloServer() {
    const server = new ApolloServer<BaseContext>({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(server, {
        context: async() => {
            return {
                dataSources: {
                    db: new DatabaseAPI()
                }
            }
        }
    }
    );
    console.log(`Up and running! Query @ ${url}`)
}

startApolloServer()