const express = require('express');
const { getTodos, createTodo, deleteTodo, updateTodoStatus } = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all todos
router.get('/getTodos', protect, getTodos);

// Create a new todo
router.post('/createTodo', protect, createTodo);

// Delete a specific todo
router.delete('/deletetodo/:id', protect, deleteTodo);

// Update the status of a specific todo
router.patch('/updatetodo/:id', protect, updateTodoStatus);

module.exports = router;
