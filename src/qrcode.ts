/**
 * QR code generation utilities
 */

import QRCode from 'qrcode';

export interface QRCodePair {
  dataQR: string;
  keyQR: string;
}

/**
 * Generate QR codes for encrypted data and decryption key
 * Returns data URLs for both QR codes
 */
export async function generateQRCodes(
  encryptedData: string,
  encryptionKey: string
): Promise<QRCodePair> {
  const baseURL = 'https://robinweitzel.de/secret_sharer';

  // Build URLs with query parameters
  const dataURL = `${baseURL}?data=${encodeURIComponent(encryptedData)}`;
  const keyURL = `${baseURL}?key=${encodeURIComponent(encryptionKey)}`;

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
 * Render a QR code to a container element
 */
export function renderQRCode(container: HTMLElement, dataURL: string): void {
  container.innerHTML = `<img src="${dataURL}" alt="QR Code" class="w-full h-auto" />`;
}
