const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Todo
const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    dueDate: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User document who owns this todo
        required: true
    }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
