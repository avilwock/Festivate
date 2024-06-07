const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Event, Task } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new Error('You must be logged in to access this resource');
        }
        
        const userData = await User.findById(context.user._id)
          .populate({
            path: 'events',
            populate: { path: 'tasks' }
          })
          .exec();
        
        if (!userData) {
          throw new Error('User data not found');
        }
        console.log(userData)
        return userData;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Error fetching user data');
      }
    },
    event: async (parent, { id }, context) => {
      try {
        const eventData = await Event.findById(id).populate('tasks');
        return eventData;
      } catch (error) {
        console.error('Error fetching event data:', error);
        throw error;
      }
    },
    task: async (parent, { id }, context) => {
      try {
        const taskData = await Task.findById(id)
          .populate('event')
          .exec();

        return taskData;
      } catch (error) {
        console.error('Error fetching task data:', error);
        throw error;
      }
    }
  },
  Mutation: {
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
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    addEvent: async (parent, { event_name, date, location, budget, venue_layout, guest_count, theme, food_options, entertainment, decorations, details }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to create an event');
      }
      const event = await Event.create({
        event_name,
        date,
        location,
        budget,
        venue_layout,
        guest_count,
        theme,
        food_options,
        entertainment,
        decorations,
        details,
        user: context.user._id
      });
      return event;
    },
    editEvent: async (parent, { eventId, event_name, date, location, budget, venue_layout, guest_count, theme, food_options, entertainment, decorations, details }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to edit an Event');
      }
      const updatedEvent = await Event.findOneAndUpdate(
        { _id: eventId, user: context.user._id },
        { event_name, date, location, budget, venue_layout, guest_count, theme, food_options, entertainment, decorations, details },
        { new: true }
      ).populate('user');
      
      if (!updatedEvent) {
        throw new Error('Event not found or you do not have permission to edit this Event');
      }
      return updatedEvent;
    },
    deleteEvent: async (parent, { eventId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to delete an event');
      }
    
      const deletedEvent = await Event.findOneAndDelete({ _id: eventId, user: context.user._id });
    
      if (!deletedEvent) {
        throw new Error('Event not found or you do not have permission to delete this event');
      }
    
      return deletedEvent;
    },
    addTask: async (parent, { task_name, details, eventId, userId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to create a task');
      }
      const task = await Task.create({
        task_name,
        details,
        user: userId,
        event: eventId
      });
      await Event.findByIdAndUpdate(eventId, { $push: { tasks: task._id } });
      return task;
    },
    editTask: async (parent, { taskId, task_name, details, complete }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to edit a task');
      }
    
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId},
        { task_name, details, complete },
        { new: true }
      ).populate('user');
    
      if (!updatedTask) {
        throw new Error('Task not found or you do not have permission to edit this task');
      }
    
      return updatedTask;
    },
    deleteTask: async (parent, { taskId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to delete a task');
      }

      console.log('taskId', taskId)

      const deletedTask = await Task.findOneAndDelete({ _id: taskId });

      if (!deletedTask) {
        throw new Error('Task not found or you do not have permission to delete this task');
      }

      return deletedTask;
    }
  }
};

module.exports = resolvers;

