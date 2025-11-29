/**
 * Crypto utilities for encrypting and decrypting secrets using AES-GCM
 */

import { arrayBufferToBase64, base64ToArrayBuffer } from './encoding';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits recommended for GCM

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*';

/**
 * Generate a cryptographically random index without modulo bias
 * Uses rejection sampling to ensure uniform distribution
 */
function getRandomIndex(max: number): number {
  const range = max;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValid = Math.floor(256 ** bytesNeeded / range) * range - 1;

  while (true) {
    const randomBytes = new Uint8Array(bytesNeeded);
    crypto.getRandomValues(randomBytes);

    let randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = randomValue * 256 + randomBytes[i];
    }

    if (randomValue <= maxValid) {
      return randomValue % range;
    }
  }
}

/**
 * Generate a random 8-character security code using Web Crypto API
 * Uses rejection sampling to avoid modulo bias
 * Ensures all character types (uppercase, lowercase, numbers, special) are included
 */
export function generateSecurityCode(): string {
  const allChars = UPPERCASE + LOWERCASE + NUMBERS + SPECIAL;

  while (true) {
    let code = '';
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSpecial = false;

    for (let i = 0; i < 8; i++) {
      const index = getRandomIndex(allChars.length);
      const char = allChars[index];
      code += char;

      if (UPPERCASE.includes(char)) hasUppercase = true;
      if (LOWERCASE.includes(char)) hasLowercase = true;
      if (NUMBERS.includes(char)) hasNumber = true;
      if (SPECIAL.includes(char)) hasSpecial = true;
    }

    if (hasUppercase && hasLowercase && hasNumber && hasSpecial) {
      return code;
    }
  }
}

/**
 * Derive the final encryption key from a base key and security code using PBKDF2
 * Uses the base key as salt and security code as password for proper key derivation
 */
async function deriveKeyFromBaseAndCode(
  baseKeyBytes: ArrayBuffer,
  securityCode: string
): Promise<CryptoKey> {
  const securityCodeBytes = new TextEncoder().encode(securityCode);

  // Import security code as key material for PBKDF2
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    securityCodeBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // Use base key as salt for PBKDF2
  // PBKDF2 with 100,000 iterations for strong key derivation
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: baseKeyBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    KEY_LENGTH
  );

  // Import derived bits as AES-GCM key
  return await crypto.subtle.importKey(
    'raw',
    derivedBits,
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
