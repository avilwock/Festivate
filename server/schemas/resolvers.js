
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
    // event: async (parent, { id }, context) => {
    //   if (context.user) {
    //     const eventData = await Event.findById(id).select('-__v -password');
    //     if (!eventData) {
    //       throw new Error('Event not found');
    //     }
    //     return eventData;
    //   }
    //   throw new AuthenticationError('Not logged in');
    // },
    // task: async(parent, { id}, context) => {
    //   if (context.user) {
    //     const taskData = await Task.findById(id).select('-__v -password');
    //     if (!taskData) {
    //       throw new Error('Task not found');
    //     }
    //     return taskData;
    //   }
    //   throw new AuthenticationError('Not logged in');
    // }
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
      if (context.user) {
        try {
          const newEvent = await Event.create({ event_name, date, location, user_id: context.user._id,});

          const user = await User.findById(context.user._id);
    
          return {
            ...newEvent._doc,
            event: user // Populate the event field with user data
          };
        } catch (error) {
          if (error.code === 11000 && error.keyPattern && error.keyValue) {
            // Handle duplicate key error
            throw new Error(`Event with event name '${event_name}' already exists`);
          } else {
            // Handle other errors
            console.error("Error creating event:", error); // Log the error for debugging
            throw new Error('Error creating event');
          }
        }
      }
      throw new AuthenticationError('Not logged in');
    },
    
    editEvent: async (parent, { eventId, event_name, date, location }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to edit an Event');
      }
      
      // Log the eventId and other relevant information
      console.log('Event ID:', eventId);
      console.log('User ID:', context.user._id);
      console.log(eventId, event_name, date, location);
      const updatedEvent = await Event.findOneAndUpdate(
        { _id: eventId, user: context.user._id }, // Check if the event belongs to the logged-in user
        { event_name, date, location }, 
        
        { new: true, populate: {path: 'user' } }
      );
      const query = { _id: eventId, user: context.user._id };
      console.log('MongoDB Query:', query);
      console.log('Updated Event:', updatedEvent); // Log the updated event
    
      if (!updatedEvent) {
        throw new Error('Event not found or you do not have permission to edit this Event');
      }
    
      return updatedEvent;
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
    addTask: async (parent, { task_name, details }, context) => {
      if (context.user) {
        try {
          const newTask = await Task.create({ task_name, details, user: context.user._id,});

          const user = await User.findById(context.user._id);
    
          return newTask;
           
        } catch (error) {
          if (error.code === 11000 && error.keyPattern && error.keyValue) {
            // Handle duplicate key error
            throw new Error(`Task with task name '${task_name}' already exists`);
          } else {
            // Handle other errors
            console.error("Error creating task:", error); // Log the error for debugging
            throw new Error('Error creating task');
          }
        }
      }
      throw new AuthenticationError('Not logged in');
    },
    editTask: async (parent, { taskId, task_name, details }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to edit a task');
      }
      
      // Log the taskId and other relevant information
      console.log('Task ID:', taskId);
      console.log('User ID:', context.user._id);
      console.log(task_name, details);
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: context.user._id }, // Check if the task belongs to the logged-in user
        { task_name, details }, 
        
        { new: true, populate: {path: 'user' } }
      );
      const query = { _id: taskId, user: context.user._id };
      console.log('MongoDB Query:', query);
      console.log('Updated Task:', updatedTask); // Log the updated task
    
      if (!updatedTask) {
        throw new Error('Task not found or you do not have permission to edit this task');
      }
    
      return updatedTask;
    },
    completeTask: async (parent, { task_name, details }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to complete a task');
      }
      const task = await Task.findByIdAndUpdate(task_name, details, { completed: true }, { new: true });

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