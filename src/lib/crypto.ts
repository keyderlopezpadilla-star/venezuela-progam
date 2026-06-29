import crypto from 'node:crypto';

/**
 * Cifrado simétrico (AES-256-GCM) para datos sensibles en DB
 * (e.g., números de identificación de beneficiarios).
 */
const ALGO = 'aes-256-gcm';

function key() {
  const k = process.env.ENCRYPTION_KEY;
  if (!k && process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY is required in production');
  }
  return Buffer.from(k || '0'.repeat(64), 'base64').subarray(0, 32);
}

export function encrypt(plain: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: enc.toString('base64'),
  };
}

export function decrypt(payload: { iv: string; tag: string; data: string }) {
  const decipher = crypto.createDecipheriv(ALGO, key(), Buffer.from(payload.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(payload.data, 'base64')),
    decipher.final(),
  ]);
  return dec.toString('utf8');
}
