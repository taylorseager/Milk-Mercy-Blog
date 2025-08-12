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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Read users from file
    const userData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const users = userData.users || [];

    // Find user
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check password
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return user info (without password)
    const { password: _, ...userInfo } = user;
    return res.status(200).json({
      user: userInfo,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
