const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const taskSchema = new Schema (
    {
    task_name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    complete: {
        type: Boolean,
        required: true,
        default: false
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    }
});

const Task = model ('Task', taskSchema);

module.exports = Task;