Basically, graphQL is a way to unfiy all the ways of generating responses to the backend. `schema.graphql` defines the interface that the frontend and backend will share (like common in JEP) and types in typescript are automatically generated based off of it

Graphql basically replaces the `router.ts` file from Aven with a `resolvers.ts` file that tells you how to populate the fields. It uses the types on each object. Graphql also (kind of) unifies and organises all the retrieval logic using a graphql and the db access pattern. 

OK next I will build my little workout app using graphql...

TODO 1/2/25: Add the frontend using Apollo Client