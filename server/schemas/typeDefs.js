const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
  }
 
`;

module.exports = typeDefs;