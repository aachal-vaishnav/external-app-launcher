import { Router } from 'express';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';   // ✅ FIXED: nanoid import

const router = Router();
const USERS = join('./data/users.json');
const SECRET = process.env.JWT_SECRET || 'dev-secret';

function readUsers() {
  return existsSync(USERS) ? JSON.parse(readFileSync(USERS)) : [];
}

function writeUsers(u) {
  writeFileSync(USERS, JSON.stringify(u, null, 2));
}

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  if (users.find(x => x.username === username)) {
    return res.status(400).json({ error: 'exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  users.push({
    id: nanoid(),          // ✅ using nanoid() now
    username,
    password: hash,
    apps: [],
    usage: {}
  });

  writeUsers(users);
  res.json({ ok: true });
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const u = users.find(x => x.username === username);
  if (!u) return res.status(400).json({ error: 'invalid' });

  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(400).json({ error: 'invalid' });

  const token = jwt.sign({ username: u.username }, SECRET, { expiresIn: '12h' });
  res.json({ token });
});

// JWT middleware
export default router;
export function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'no token' });

  const token = h.split(' ')[1];
  try {
    const data = jwt.verify(token, SECRET);
    req.user = data;
    next();
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
  }
}
