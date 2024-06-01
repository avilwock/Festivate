const db = require('../config/connection');
const { User } = require('../models/User');
const userSeeds = require('./userSeeds.json');
//const cleanDB = require('./cleanDB');

db.once('open', async () => {
    try {
        //await cleanDB('Profile', 'profiles');

        await User.create(userSeeds);

        console.log('all done!');
        process.exit(0);
    } catch (err) {
        throw err;
    }
});