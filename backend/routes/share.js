import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { nanoid } from 'nanoid';

const router = Router();
const SHARES = join('./data/shares.json');
function readShares(){ return existsSync(SHARES)? JSON.parse(readFileSync(SHARES)) : {}; }
function writeShares(s){ writeFileSync(SHARES, JSON.stringify(s,null,2)); }

// create share
router.post('/', (req,res)=>{
  const pack = req.body.pack; // json of apps
  if(!pack) return res.status(400).json({error:'missing'});
  const id = nanoid(8);
  const shares = readShares();
  shares[id] = { pack, createdAt: Date.now() };
  writeShares(shares);
  res.json({ id, url: `${process.env.BACKEND_ROOT || 'http://localhost:5000'}/api/share/${id}` });
});

// get share
router.get('/:id', (req,res)=>{
  const shares = readShares();
  const s = shares[req.params.id];
  if(!s) return res.status(404).json({ error:'notfound' });
  res.json({ pack: s.pack, createdAt: s.createdAt });
});

export default router;
