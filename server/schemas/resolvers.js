
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Event, Task } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth')

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
      const correctPw = await user.isCorrectPassword(password);
  
            if (!correctPw) {
                throw new AuthenticationError('Incorrect Password');
            }
  
            const token = signToken(user);
  
            return { token, user };
        },
    // Resolver for adding new user
    addUser: async (parent, { username, email, password }) => {
     
      const user = await User.create({ username, email, password });
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
    editEvent: async (parent, { eventId, name, date, location }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to edit an event');
      }
      const event = await Event.findOneAndUpdate(
        { _id: eventId, user: context.user._id },
        { name, date, location },
        { new: true }
      );
      if (!event) {
        throw new AuthenticationError('Event not found or you do not have permission to edit this event');
      }
      return event;
    },
deleteEvent: async (parent, {eventId}, context) => {
  if (!context.user) {
    throw new AuthenticationError('You need to be logged in to delete this event');
  }
  const event = await Event.findOneAndDelete({_id: eventId, user: context.userId});
  if (!event) {
    throw new AuthenticationError('Event not found');
  }
  return event;
},
    // Resolver for adding a new task
    addTask: async (parent, { task_name }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to add a task');
      }
      const task = await Task.create({ task_name });
      return task;
    },
    editTask: async (parent, { task_name }, context) => {

      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to edit a task');
      }
      const task = await Task.findOneAndUpdate(
        {user: context.user._id },

        {task_name },
        { new: true }
      );
      if (!task) {
        throw new AuthenticationError('Task not found or you do not have permission to edit this task');
      }
      return task;
    },
    // Resolver for marking a task complete

    completeTask: async (parent, { task_name }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to complete a task');
      }
      const task = await Task.findByIdAndUpdate(task_name, { completed: true }, { new: true });

      return task;
    },
  },
  // Resolver for task type
  // Task: {
  //   event: async (parent) => {
  //     return await Event.findById(parent.event); // find and return the event associate with the task
  //   },
  // },
  // // Resolver for event type
  // Event: {
  //   // Resolver function for taskList field
  //   tasksList: async (parent) => {
  //     return await Task.find({ _id: { $in: parent.tasksList } }); //find and return all tasks associate with the event
  //   },
  // }
};

module.exports = resolvers;