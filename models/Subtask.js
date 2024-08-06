const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Subtask
const subtaskSchema = new Schema({
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
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'MainTask',  // Reference to the MainTask document this subtask belongs to
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User document who owns this subtask
        required: true
    }
}, { timestamps: true });

const Subtask = mongoose.model('Subtask', subtaskSchema);

module.exports = Subtask;
