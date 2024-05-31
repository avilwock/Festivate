const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const taskSchema = new Schema (
    {
    task_name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },    
    details: {
        type: String,
        required: false
    },  
});

const Task = model ('Task', taskSchema);

module.exports = Task;