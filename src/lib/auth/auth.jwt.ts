import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { env } from '../env';

if (!env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET undefined');
}

const SECRET_KEY = new TextEncoder().encode(env.AUTH_SECRET);

// Generate JWT
export async function generateJWT(payload: Record<string, unknown>, expiresIn: string | number = '24hrs'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);
}

// Verifying JWT
export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload; // Return data decoded if the token is valid
  } catch (error) {
    console.error('Error to verify JWT:', error);
    throw new Error('Token invalid or expired');
  }
}

export async function createJWT(payload: Record<string, unknown>): Promise<string> {
  const token = await generateJWT(payload);
  console.log('Token generated:', token);
  return token;
}
