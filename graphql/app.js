const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema'); // Use '@graphql-tools/schema' for schema creation
const typeDefs = require('./typedefs'); // Import the GraphQL typeDefs
const resolvers = require('./resolvers'); // Import the GraphQL resolvers

const app = express();
const port = 4000; // Set the port from environment variables or default to 4000

// Create the executable schema using typeDefs and resolvers
const executableSchema = makeExecutableSchema({
  typeDefs, // GraphQL schema definitions
  resolvers, // GraphQL resolvers
});

// Enable CORS
app.use(cors());

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GraphQL endpoint setup
app.use(
  '/graphql',
  graphqlHTTP({
    schema: executableSchema, // Attach the GraphQL schema
    graphiql: true, // Enable GraphiQL for testing and exploring the API
  })
);

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`GraphQL API server running at http://localhost:${port}/graphql`);
});
