const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Main Task
const mainTaskSchema = new Schema({
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
    subtasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Subtask'  // Array of references to Subtask documents
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User document who owns this main task
        required: true
    }
}, { timestamps: true });

const MainTask = mongoose.model('MainTask', mainTaskSchema);

module.exports = MainTask;
