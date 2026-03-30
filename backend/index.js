const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Allows us to use process.env variables (fallback for local dev)

// 2. Initialize the Express App
const app = express();

// 3. Global Middleware
// CORS allows your React frontend (port 5173/3000) to communicate with this backend (port 5000)
app.use(cors({
  origin: '*', // This allows EVERYONE to talk to the backend (Fixes the 403)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 
// Parses incoming JSON payloads (req.body) from the frontend
app.use(express.json()); 

const User = require('./models/User'); // Ensure the path to your model is correct

const seedUser = async () => {
  try {
    // 1. Check if the admin already exists so we don't create duplicates
    const userExists = await User.findOne({ username: 'admin' });
    
    if (!userExists) {
      // 2. Create the first Coordinator
      await User.create({ 
        username: 'admin', 
        password: 'password123', 
        role: 'Coordinator' 
      });
      console.log('👤 SEEDER: Test Admin Created (admin / password123)');
    } else {
      console.log('ℹ️ SEEDER: Admin user already exists. Skipping...');
    }
  } catch (error) {
    console.error('SEEDER ERROR:', error.message);
  }
};

// 3. Trigger the function after connecting to the DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected`);
    
    // RUN THE SEEDER HERE
    await seedUser(); 
    
  } catch (error) {
    console.error(`Connection Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// 5. Mount the Routes
// This links the URLs to the specific route files we created earlier
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));

// Basic health-check route so you can test if the server is running in your browser
app.get('/', (req, res) => {
  res.send('Project RZ2 API is running...');
});

// 6. Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});