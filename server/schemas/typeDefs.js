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
  }

  type Task {
    _id: ID!
    task_name: String!
  }

  input TaskInput {
    _id: ID!
    task_name: String!
  }

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  addEvent(name: String!, date: String!, location: String!): Event
  editEvent(name:String!, date: String!, location: String!): Event
  deleteEvent(eventId: ID): Event

  addTask(task_name: String!): Task
  editTask(task_name: String!): Task

  completeTask(taskId: ID): Task
}

schema {
  query: Query

  mutation: Mutation
}
`;

module.exports = typeDefs;