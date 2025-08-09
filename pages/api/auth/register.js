import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const usersFile = path.join(process.cwd(), 'data', 'users.json');
const usersDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
}

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Basic validation
    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Read users from file
    const userData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const users = userData.users || [];

    // Check if username or email already exists
    const existingUser = users.find((u) => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: existingUser.username === username
          ? 'Username already exists'
          : 'Email already exists',
      });
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Add to users array
    users.push(newUser);
    userData.users = users;

    // Write back to file
    fs.writeFileSync(usersFile, JSON.stringify(userData, null, 2));

    // Return user info (without password)
    const { password: _, ...userInfo } = newUser;
    return res.status(201).json({
      user: userInfo,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
