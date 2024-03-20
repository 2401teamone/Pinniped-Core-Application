import crypto from 'crypto';

export default function generateRandomUUID(size = 7) {
  return crypto.randomBytes(size).toString('hex');
}