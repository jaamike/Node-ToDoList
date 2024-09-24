const Todo = require('../models/Todo');

// Get all todos for the logged-in user, selecting only required fields
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).select('title description status');
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a specific todo for the logged-in user
const deleteTodo = async (req, res) => {
  try {
    // Find the todo by its ID and delete it if it belongs to the logged-in user
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized to delete' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific todo's status for the logged-in user
const updateTodoStatus = async (req, res) => {
  try {
    // Find the todo by its ID and update its status
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: req.body.status }, 
      { new: true } 
    ).select('title description status');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized to update' });
    }

    res.json(todo); // Send back the updated task
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Create a new todo
const createTodo = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  try {
    const todo = new Todo({
      user: req.user._id,
      title,
      description,
    });

    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodoStatus
};
