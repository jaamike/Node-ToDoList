// index.js

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cors = require('cors'); // Import cors

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));














// const express =  require('express')
// const mongoose = require('mongoose')
// const app = express()




// app.get('/', (req, res) => {
//     res.send("Hello from Node API test")
// })

// mongoose.connect('mongodb+srv://admin:1234*@backenddb.rwxb3yg.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB')
//   .then(() => {
//     console.log('Connected to database!');
//     app.listen(3000, () => {
//         console.log('Server is running on port 3000');
//     })
//   })
//   .catch(() => {
//     console.log('Connection failed');
//   })
