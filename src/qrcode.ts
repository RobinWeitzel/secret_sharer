/**
 * QR code generation utilities
 */

import QRCode from 'qrcode';
import { getDecryptPageURL } from './utils';

export interface QRCodePair {
  dataQR: string;
  keyQR: string;
}

export interface QRCodeSet {
  dataQR: string;
  keyQR: string;
  dataOnlyQR: string;
  keyOnlyQR: string;
}

/**
 * Generate QR codes for encrypted data and decryption key
 * Returns data URLs for both QR codes
 */
export async function generateQRCodes(
  encryptedData: string,
  encryptionKey: string
): Promise<QRCodePair> {
  const decryptURL = getDecryptPageURL();

  // Build URLs with URI fragments
  const dataURL = `${decryptURL}#data=${encodeURIComponent(encryptedData)}`;
  const keyURL = `${decryptURL}#key=${encodeURIComponent(encryptionKey)}`;

  // Generate QR codes as data URLs
  const dataQR = await QRCode.toDataURL(dataURL, {
    errorCorrectionLevel: 'M',
    width: 400,
    margin: 2,
  });

  const keyQR = await QRCode.toDataURL(keyURL, {
    errorCorrectionLevel: 'M',
    width: 400,
    margin: 2,
  });

  return { dataQR, keyQR };
}

/**
 * Generate complete QR code set including data-only versions for fallback
 */
export async function generateQRCodeSet(
  encryptedData: string,
  encryptionKey: string
): Promise<QRCodeSet> {
  const decryptURL = getDecryptPageURL();

  // Build URLs with URI fragments
  const dataURL = `${decryptURL}#data=${encodeURIComponent(encryptedData)}`;
  const keyURL = `${decryptURL}#key=${encodeURIComponent(encryptionKey)}`;

  // Generate QR codes with URLs
  const dataQR = await QRCode.toDataURL(dataURL, {
    errorCorrectionLevel: 'M',
    width: 400,
    margin: 2,
  });

  const keyQR = await QRCode.toDataURL(keyURL, {
    errorCorrectionLevel: 'M',
    width: 400,
    margin: 2,
  });

  // Generate data-only QR codes (without URLs) for fallback
  const dataOnlyQR = await QRCode.toDataURL(encryptedData, {
    errorCorrectionLevel: 'M',
    width: 300,
    margin: 1,
  });

  const keyOnlyQR = await QRCode.toDataURL(encryptionKey, {
    errorCorrectionLevel: 'M',
    width: 300,
    margin: 1,
  });

  return { dataQR, keyQR, dataOnlyQR, keyOnlyQR };
}

/**
 * Render a QR code to a container element
 */
export function renderQRCode(container: HTMLElement, dataURL: string): void {
  container.innerHTML = `<img src="${dataURL}" alt="QR Code" class="w-full h-auto" />`;
}
