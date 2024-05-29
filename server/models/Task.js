const { Schema, model } = require('mongoose')

const taskSchema = new Schema (
    {
    text: {
        type: String,
        required: true
    }
});

const Task = model ('Task', taskSchema);

module.exports = Task;