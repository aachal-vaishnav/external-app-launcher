import { Router } from 'express';
import fetch from 'node-fetch';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { nanoid } from 'nanoid';      // ✅ FIXED here
//import { encrypt } from '../utils/crypto.js';

const router = Router();
const SHARES = join('./data/shares.json');

// store share packs (small)
function readShares() {
  return existsSync(SHARES) ? JSON.parse(readFileSync(SHARES)) : {};
}

function writeShares(s) {
  writeFileSync(SHARES, JSON.stringify(s, null, 2));
}

// Example: start OAuth for GitHub (frontend opens /api/oauth/github/start?appId=xxx)
router.get('/github/start', (req, res) => {
  const appId = req.query.appId;
  const clientId = process.env.GITHUB_CLIENT_ID || '';
  const redirect = `${process.env.BACKEND_ROOT || 'http://localhost:5000'}/api/oauth/github/callback?appId=${appId}`;
  const state = nanoid();   // ✅ replaced uuidv4() with nanoid()
  
  // store state -> in-memory for demo, but can persist
  // redirect user to GitHub authorize URL
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=repo%20read:user&state=${state}`;
  res.json({ url, state });
});

// callback endpoint (exchange code -> token) (example flow)
router.get('/github/callback', async (req, res) => {
  const code = req.query.code;
  const appId = req.query.appId;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  // exchange
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    })
  });

  const tokenJson = await tokenRes.json();
  const token = tokenJson.access_token;

  // for demo we return token (in real flow POST to frontend or set cookie)
  res.send(`<script>
    window.opener.postMessage({ type: 'oauth-token', token: '${token}', appId: '${appId}' }, '*');
    window.close();
  </script>`);
});

export default router;
