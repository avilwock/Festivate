
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Event, Task } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  // Resolver for fetching current user data
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    // Resolver for user login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    // Resolver for adding new user
    addUser: async (parent, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
      const token = signToken(user);
      return { token, user };
    },
    // Resolver for adding new event
    addEvent: async (parent, { name, date, location }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to create an event');
      }
      const event = await Event.create({
        name,
        date,
        location,
        user: context.user._id,
      });
      return event;
    },
    // Resolver for adding a new task
    addTask: async (parent, { description, eventId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to add a task');
      }
      const task = await Task.create({ description, event: eventId });
      await Event.findByIdAndUpdate(eventId, { $push: { tasksList: task._id } });
      return task;
    },
    // Resolver for marking a task complete
    completeTask: async (parent, { taskId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to complete a task');
      }
      const task = await Task.findByIdAndUpdate(taskId, { completed: true }, { new: true });
      return task;
    },
  },
  // Resolver for task type
  Task: {
    event: async (parent) => {
      return await Event.findById(parent.event); // find and return the event associate with the task
    },
  },
  // Resolver for event type
  Event: {
    // Resolver function for taskList field
    tasksList: async (parent) => {
      return await Task.find({ _id: { $in: parent.tasksList } }); //find and return all tasks associate with the event
    },
  }
};

module.exports = resolvers;