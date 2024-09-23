const express = require('express');
const { getTodos, createTodo } = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getTodos);
router.post('/', protect, createTodo);

module.exports = router;
