
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Event, Task } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
  // Resolver for fetching current user data
  Query: {
    me: async (parent, args, context) => {
      try {
        if (!context.user) {
          throw new Error('You must be logged in to access this resource');
        }
        
        // Fetch user data with populated events and tasks
        const userData = await User.findById(context.user._id)
          .populate({
            path: 'events',
            populate: { path: 'tasks' } // Populate tasks under each event
          })
          .exec();
        
        if (!userData) {
          throw new Error('User data not found');
        }
        
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
        console.error('Error fetching event data:', error); // Add this console log
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
        console.error('Error fetching task data:', error); // Add this console log
        throw error;
      }
    }
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
    addEvent: async (parent, { event_name, date, location }, context) => {
      try {
        if (!context.user) {
          throw new AuthenticationError('You must be logged in to create an event');
        }
        // Check if the event name already exists
        const existingEvent = await Event.findOne({ event_name });
        if (existingEvent) {
          throw new Error('An event with this name already exists');
        }
        // Create a new event
        const event = new Event({
          event_name,
          date,
          location,
          user: context.user._id
        });
        // Save the event
        const savedEvent = await event.save();
        return savedEvent; // Return the saved event directly

      } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Error creating event');
      }
    },
    //completed and works
    editEvent: async (parent, { eventId, event_name, date, location, venue_layout, invitations, guest_count, theme, food_options, entertainment, decorations, details }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to edit an Event');
      }
      const updatedEvent = await Event.findOneAndUpdate(
        { _id: eventId, user: context.user._id }, // Check if the event belongs to the logged-in user
        { event_name, date, location }, 
        
        { new: true, populate: {path: 'user' } }
      );
      const query = { _id: eventId, user: context.user._id };
      
      if (!updatedEvent) {
        throw new Error('Event not found or you do not have permission to edit this Event');
      }
      return updatedEvent;
    },
    deleteEvent: async (parent, { eventId }, context) => {
      try {
        if (!context.user) {
          throw new AuthenticationError('You must be logged in to delete an event');
        }
    
        // Find the event by ID and user ID to ensure the event belongs to the logged-in user
        const deletedEvent = await Event.findOneAndDelete({ _id: eventId, user: context.user._id });
    
        if (!deletedEvent) {
          throw new Error('Event not found or you do not have permission to delete this event');
        }
    
        return deletedEvent;
      } catch (error) {
        console.error('Error deleting event:', error);
        throw new Error('Error deleting event');
      }
    },
     // Resolver for adding a new task
    addTask: async (parent, { task_name, details, eventId, userId }, context) => {
      try {
        // Check if the user is authenticated
        if (!context.user) {
          throw new AuthenticationError('You must be logged in to create a task');
        }
            // Create a new task
        const task = new Task({
          task_name,
          details,
          user: userId,
          event: eventId // Set the eventId for the task
        });
    
        // Save the task
        const savedTask = await task.save();

        await Event.findByIdAndUpdate(eventId, { $push: { tasks: savedTask._id } });
    
        return savedTask;
    
      } catch (error) {
        console.error('Error creating task:', error);
        throw new Error('Error creating task');
      }
    },
    editTask: async (parent, { taskId, task_name, details, complete }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to edit a task');
      }
    
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: context.user._id }, // Check if the task belongs to the logged-in user
        { task_name, details, complete }, 
        
        { new: true, populate: {path: 'user' } }
      );
      const query = { _id: taskId, user: context.user._id };
    
      if (!updatedTask) {
        throw new Error('Task not found or you do not have permission to edit this task');
      }
    
      return updatedTask;
    },
    deleteTask: async ( parent, { taskId }, context) => {
      try {
        if (!context.user) {
          throw new AuthenticationError('You must be logged in to delete a task')
        }

        const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: context.user._id});

        if (!deletedTask) {
          throw new Error ('Task not found or you do not have permission to delete this task')
        }

        return deletedTask;
      } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error('Error deleting event');
      }
    }
  },
};

module.exports = resolvers;