/**
 * Crypto utilities for encrypting and decrypting secrets using AES-GCM
 */

import { arrayBufferToBase64, base64ToArrayBuffer } from './encoding';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits recommended for GCM

/**
 * Generate a random 8-character security code
 * Contains numbers, uppercase, lowercase, and special characters
 */
export function generateSecurityCode(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  const allChars = uppercase + lowercase + numbers + special;

  const randomValues = new Uint8Array(8);
  crypto.getRandomValues(randomValues);

  let code = '';
  let hasUppercase = false;
  let hasLowercase = false;
  let hasNumber = false;
  let hasSpecial = false;

  for (let i = 0; i < 8; i++) {
    const charSet = allChars;
    const index = randomValues[i] % charSet.length;
    const char = charSet[index];
    code += char;

    if (uppercase.includes(char)) hasUppercase = true;
    if (lowercase.includes(char)) hasLowercase = true;
    if (numbers.includes(char)) hasNumber = true;
    if (special.includes(char)) hasSpecial = true;
  }

  // Ensure all character types are included
  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return generateSecurityCode(); // Regenerate if requirements not met
  }

  return code;
}

/**
 * Derive the final encryption key from a base key and security code
 * Combines base key bytes with security code bytes and hashes them
 */
async function deriveKeyFromBaseAndCode(
  baseKeyBytes: ArrayBuffer,
  securityCode: string
): Promise<CryptoKey> {
  const securityCodeBytes = new TextEncoder().encode(securityCode);

  // Combine base key and security code
  const combined = new Uint8Array(baseKeyBytes.byteLength + securityCodeBytes.length);
  combined.set(new Uint8Array(baseKeyBytes), 0);
  combined.set(securityCodeBytes, baseKeyBytes.byteLength);

  // Hash the combination to get exactly 32 bytes for AES-256
  const keyMaterial = await crypto.subtle.digest('SHA-256', combined);

  // Import as AES-GCM key
  return await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Export a CryptoKey to base64 string for storage in QR code
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

/**
 * Import a base64 key string back to CryptoKey
 */
export async function importKey(keyBase64: string): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(keyBase64);
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data with a given base key and security code
 * Returns base64 encoded string containing IV + encrypted data
 */
export async function encrypt(
  data: string,
  baseKey: CryptoKey,
  securityCode: string
): Promise<string> {
  const baseKeyBytes = await crypto.subtle.exportKey('raw', baseKey);
  const finalKey = await deriveKeyFromBaseAndCode(baseKeyBytes, securityCode);

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encodedData = new TextEncoder().encode(data);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    finalKey,
    encodedData
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return arrayBufferToBase64(combined.buffer);
}

/**
 * Decrypt data with a given base key and security code
 * Input is base64 encoded string containing IV + encrypted data
 */
export async function decrypt(
  encryptedBase64: string,
  baseKey: CryptoKey,
  securityCode: string
): Promise<string> {
  const baseKeyBytes = await crypto.subtle.exportKey('raw', baseKey);
  const finalKey = await deriveKeyFromBaseAndCode(baseKeyBytes, securityCode);

  const combined = base64ToArrayBuffer(encryptedBase64);

  // Extract IV and encrypted data
  const iv = combined.slice(0, IV_LENGTH);
  const encrypted = combined.slice(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    finalKey,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}
