const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const taskSchema = new Schema (
    {
    task_name: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },    
});

const Task = model ('Task', taskSchema);

module.exports = Task;