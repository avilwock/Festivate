const typeDefs = `
type Query {
  me: User
  event(id: ID!): Event
  task(id: ID!): Task
}
  type User {
    _id: ID!
    username: String!
    email: String!
    events: [Event]
    tasks: [Task]
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
  }

  type Task {
    _id: ID!
    task_name: String!
    details: String
    complete: Boolean
    user: User
  }

  input TaskInput {
    _id: ID!
    task_name: String!
    details: String
    complete: Boolean
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addEvent(event_name: String!, date: String!, location: String!): Event
    editEvent(eventId: ID!, event_name:String!, date: String!, location: String!): Event
    deleteEvent(eventId: ID): Event
  
    addTask(task_name: String!, details: String): Task
    editTask(taskId: ID!, task_name: String!, details: String): Task
    deleteTask(taskId: ID): Task

    completeTask(taskId: ID!): Task
  }

schema {
  query: Query
  mutation: Mutation
}
`;

module.exports = typeDefs;