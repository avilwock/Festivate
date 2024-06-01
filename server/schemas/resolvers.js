
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Event, Task } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
  // Resolver for fetching current user data
  Query: {
    me: async (parent, args, context) => {
      try {
        if (context.user) {
          const userData = await User.findById(context.user._id)
            .select('-__v -password')
            .populate('events')
            .populate('tasks');
    
          console.log('User data:', userData); // Add this console log
    
          if (!userData) {
            console.log('User data not found');
            return null;
          }
    
          if (!userData.events) {
            console.log('User has no events');
          } else {
            console.log('User events:', userData.events);
          }
    
          if (!userData.tasks) {
            console.log('User has no tasks');
          } else {
            console.log('User tasks:', userData.tasks);
          }
    
          return userData;
        } else {
          throw new AuthenticationError('Not logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error); // Add this console log
        throw error;
      }
    },
    

event: async (parent, { id }, context) => {
  try {
    const eventData = await Event.findById(id).populate('user');

    console.log('Event data:', eventData); // Add this console log

    return eventData;
  } catch (error) {
    console.error('Error fetching event data:', error); // Add this console log
    throw error;
  }
},

task: async (parent, { id }, context) => {
  try {
    const taskData = await Task.findById(id).populate('user');

    console.log('Task data:', taskData); // Add this console log

    return taskData;
  } catch (error) {
    console.error('Error fetching task data:', error); // Add this console log
    throw error;
  }
}
    
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
      try {
        if (context.user) {
          throw new AuthenticationError('You must be logged in to create an event');
        }
    
        const event = new Event({
          event_name,
          date,
          location,
          user: context.user._id
        });
    
        const savedEvent = await event.save();
        return savedEvent;
      } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Error creating event');
      }
    },
    //completed and works
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
    completeTask: async (parent, { taskId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to complete a task');
      }

      const task = await Task.findByIdAndUpdate(
        taskId,
        { complete: true },
        { new: true }
      );

      return task;
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