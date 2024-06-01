const typeDefs = `
type Query {
  User: [User]!
  user(id: ID!): User
  event(id: ID!): Event
  task(id: ID!): Task
  me: User
}
  type User {
    _id: ID!
    username: String!
    email: String!
    events: [Event!]!
  }
  type Auth {
    token: String!
    user: User!
  }
  
  type Event {
    _id: ID!
    event_name: String!
    date: String!
    location: String
    user: User
    tasks: [Task]!
  }

  type Task {
    _id: ID!
    task_name: String!
    details: String
    complete: Boolean
    user: User
    event: Event!
  }

  input TaskInput {
    task_name: String!
    details: String
    complete: Boolean
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addEvent(event_name: String!, date: String!, location: String!): Event
    editEvent(eventId: ID!, event_name:String!, date: String!, location: String!): Event
    deleteEvent(eventId: ID!): Event
  
    addTask(task_name: String!, details: String, eventId: ID!, userId: ID!): Task
    editTask(taskId: ID!, task_name: String!, details: String, complete: Boolean): Task
    deleteTask(taskId: ID!): Task

    #completeTask(taskId: ID!): Task
  }

schema {
  query: Query
  mutation: Mutation
}
`;

module.exports = typeDefs;