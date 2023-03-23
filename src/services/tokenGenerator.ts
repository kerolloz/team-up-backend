import { randomBytes } from 'crypto';

/**
 * returns a random hex string
 * @param tokenLength default: 16
 */
export function generateToken(tokenLength = 16): string {
  return randomBytes(tokenLength).toString('hex');
}
