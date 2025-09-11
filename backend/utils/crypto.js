import crypto from 'crypto';

const ALGO='aes-256-gcm';
const KEY_HEX = process.env.ENCRYPTION_KEY || ''; // MUST set in env for secure storage

if (!KEY_HEX || KEY_HEX.length !== 64) {
  console.warn('Warning: ENCRYPTION_KEY not set or incorrect length. Set a 32-byte hex string in env for production.');
}
const KEY = Buffer.from(KEY_HEX || crypto.randomBytes(32).toString('hex'), 'hex');

export function encrypt(text){
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(text,'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}.${tag.toString('hex')}.${enc.toString('hex')}`;
}
export function decrypt(payload){
  const [ivHex, tagHex, dataHex] = payload.split('.');
  const iv=Buffer.from(ivHex,'hex'), tag=Buffer.from(tagHex,'hex'), data=Buffer.from(dataHex,'hex');
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  return decipher.update(data).toString('utf8') + decipher.final('utf8');
}
