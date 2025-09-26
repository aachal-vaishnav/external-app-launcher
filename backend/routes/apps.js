import { Router } from 'express';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { nanoid } from 'nanoid';
import { authMiddleware } from './auth.js';
import { encrypt, decrypt } from '../utils/crypto.js';

const router = Router();
const DATA = join('./data/users.json');

// helpers
function readUsers() {
  return existsSync(DATA) ? JSON.parse(readFileSync(DATA)) : [];
}

function writeUsers(u) {
  writeFileSync(DATA, JSON.stringify(u, null, 2));
}

router.use(authMiddleware);

// get apps
router.get('/', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.username === req.user.username);
  res.json(user?.apps || []);
});

// add app
router.post('/', (req, res) => {
  const appsPayload = req.body;
  const users = readUsers();
  const idx = users.findIndex(u => u.username === req.user.username);

  const app = {
    id: nanoid(),
    name: appsPayload.name,
    url: appsPayload.url,
    category: appsPayload.category || 'Other',
    provider: appsPayload.provider || '',
    favorite: false,
    useCount: 0,
    lastOpened: null,
    createdAt: Date.now()
  };

  users[idx].apps.push(app);
  writeUsers(users);
  res.json(app);
});

// update app
router.put('/:id', (req, res) => {
  const users = readUsers();
  const idx = users.findIndex(u => u.username === req.user.username);
  const apps = users[idx].apps;
  const i = apps.findIndex(a => a.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'notfound' });

  apps[i] = { ...apps[i], ...req.body };
  users[idx].apps = apps;
  writeUsers(users);
  res.json(apps[i]);
});

// delete app
router.delete('/:id', (req, res) => {
  const users = readUsers();
  const idx = users.findIndex(u => u.username === req.user.username);
  users[idx].apps = users[idx].apps.filter(a => a.id !== req.params.id);
  writeUsers(users);
  res.json({ ok: true });
});

// increment usage
router.post('/:id/usage', (req, res) => {
  const users = readUsers();
  const idx = users.findIndex(u => u.username === req.user.username);
  const app = users[idx].apps.find(a => a.id === req.params.id);
  if (!app) return res.status(404).json({ error: 'notfound' });

  app.useCount = (app.useCount || 0) + 1;
  app.lastOpened = Date.now();
  users[idx].apps = users[idx].apps.map(a => a.id === app.id ? app : a);
  writeUsers(users);
  res.json({ ok: true, useCount: app.useCount });
});

// store credentials encrypted for an app (API key / OAuth tokens metadata)
router.post('/:id/credentials', (req, res) => {
  const { secret } = req.body;
  if (!secret) return res.status(400).json({ error: 'missing' });

  const users = readUsers();
  const idx = users.findIndex(u => u.username === req.user.username);
  const app = users[idx].apps.find(a => a.id === req.params.id);
  if (!app) return res.status(404).json({ error: 'notfound' });

  const enc = encrypt(secret);
  app.encryptedSecret = enc;
  users[idx].apps = users[idx].apps.map(a => a.id === app.id ? app : a);
  writeUsers(users);
  res.json({ ok: true });
});

// get metadata (do not return secret)
router.get('/:id/credentials', (req, res) => {
  const users = readUsers();
  const idx = users.findIndex(u => u.username === req.user.username);
  const app = users[idx].apps.find(a => a.id === req.params.id);
  if (!app) return res.json({ connected: false });

  res.json({ connected: !!app.encryptedSecret });
});

export default router;
