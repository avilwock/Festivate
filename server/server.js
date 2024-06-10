require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const { ApolloServer } = require("@apollo/server");
const path = require("path");
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require("./utils/auth");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server
async function startApolloServer() {
  await server.start();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Serve up static assets in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get('/service-worker.js', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/sw.js'), {
        headers: {
          'Content-Type': 'application/javascript'
        }
      });
    });


    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the Express server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();

