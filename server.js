// server.js
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory storage
const users = [];

// ✅ Middleware
app.use(express.static('public')); // Serve static files from 'public' folder
app.use(express.urlencoded({ extended: true })); // Parse form data (HTML forms)
app.use(express.json()); // Parse JSON (fetch requests)

// ✅ Session middleware
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
}));

// ✅ Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword, role });

    res.status(200).json({ message: 'Signup successful! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
});

// ✅ Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Set session
    req.session.user = { username: user.username, role: user.role };
    res.status(200).json({ message: 'Login successful!', role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// ✅ Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});

app.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
  
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists!' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword, role });
    req.session.user = { username, role };
    res.json({ message: 'Signup successful!', redirectTo: '/category.html' });
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
  
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
  
    req.session.user = { username: user.username, role: user.role };
    res.json({ message: 'Login successful!', redirectTo: '/category.html' });
  });
  