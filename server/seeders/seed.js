const db = require('../config/connection');
const { User, Event, Task } = require('../models');
const userSeeds = require('./userSeeds.json');
const eventSeeds = require('./eventSeeds.json');
const taskSeeds = require('./taskSeeds.json');

db.once('open', async () => {
    try {
        // Clean up the database
        await User.deleteMany({});
        await Event.deleteMany({});
        await Task.deleteMany({});

        // Seed users
        const users = await User.create(userSeeds);

        // Map user IDs to events
        const events = eventSeeds.map((event, index) => ({
            ...event,
            user: users[index % users.length]._id
        }));

        // Seed events
        const createdEvents = await Event.insertMany(events);

        // Map event and user IDs to tasks
        const tasks = taskSeeds.map((task, index) => ({
            ...task,
            user: users[index % users.length]._id,
            event: createdEvents[index % createdEvents.length]._id
        }));

        // Seed tasks
        await Task.insertMany(tasks);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
