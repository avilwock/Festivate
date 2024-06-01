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
        defaultValue: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },    
});

const Task = model ('Task', taskSchema);

module.exports = Task;