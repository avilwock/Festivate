const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const eventSchema = new Schema(
    {
        event_name: {
            type: String,
            required: true,
            unique: true,
        },
        budget: {
            type: Number,
            min: 0
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
        },
        venue_layout: {
            type: String,
        },
        invitations: {
            type: String,
        },
        guest_count: {
            type: Number,
        },
        theme: {
            type: String,
        },
        food_options: {
            type: String,
        },
        entertainment: {
            type: String,
        },
        decorations: {
            type: String,
        },
        details: {
            type: String,
        },
        user: { type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            ref: 'User' 
        },
        tasks: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Task' 
        }]
    }
)

const Event = model('Event', eventSchema);
module.exports = Event;