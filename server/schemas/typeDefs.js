const typeDefs = `
type Query {
  me: User
}
  type User {
    _id: ID!
    username: String!
    email: String!
  }
  type Auth {
    token: String!
    user: User!
  }
  
  type Event {
    _id: ID!
    name: String!
    date: String!
    location: String
    tasksList: [Task]
  }

  type Task {
    _id: ID!
    description: String!
    event: String!
  }

  input TaskInput {
    _id: ID!
    description: String!
  }

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  addEvent(name: String!, date: String!, location: String!): Event
  addTask(description: String!): Event
  completeTask(taskId: ID): Event
}

schema {
  query: Query
  mutation: Mutation
}
`;

module.exports = typeDefs;