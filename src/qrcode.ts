/**
 * QR code generation utilities
 */

import QRCode from 'qrcode';
import { getDecryptPageURL } from './utils';

const QR_CODE_WIDTH_LARGE = 400;
const QR_CODE_WIDTH_SMALL = 300;
const QR_CODE_MARGIN_STANDARD = 2;
const QR_CODE_MARGIN_COMPACT = 1;
const QR_ERROR_CORRECTION_LEVEL = 'M' as const;

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
    errorCorrectionLevel: QR_ERROR_CORRECTION_LEVEL,
    width: QR_CODE_WIDTH_LARGE,
    margin: QR_CODE_MARGIN_STANDARD,
  });

  const keyQR = await QRCode.toDataURL(keyURL, {
    errorCorrectionLevel: QR_ERROR_CORRECTION_LEVEL,
    width: QR_CODE_WIDTH_LARGE,
    margin: QR_CODE_MARGIN_STANDARD,
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
    errorCorrectionLevel: QR_ERROR_CORRECTION_LEVEL,
    width: QR_CODE_WIDTH_LARGE,
    margin: QR_CODE_MARGIN_STANDARD,
  });

  const keyQR = await QRCode.toDataURL(keyURL, {
    errorCorrectionLevel: QR_ERROR_CORRECTION_LEVEL,
    width: QR_CODE_WIDTH_LARGE,
    margin: QR_CODE_MARGIN_STANDARD,
  });

  // Generate data-only QR codes (without URLs) for fallback
  const dataOnlyQR = await QRCode.toDataURL(encryptedData, {
    errorCorrectionLevel: QR_ERROR_CORRECTION_LEVEL,
    width: QR_CODE_WIDTH_SMALL,
    margin: QR_CODE_MARGIN_COMPACT,
  });

  const keyOnlyQR = await QRCode.toDataURL(encryptionKey, {
    errorCorrectionLevel: QR_ERROR_CORRECTION_LEVEL,
    width: QR_CODE_WIDTH_SMALL,
    margin: QR_CODE_MARGIN_COMPACT,
  });

  return { dataQR, keyQR, dataOnlyQR, keyOnlyQR };
}

/**
 * Render a QR code to a container element
 */
export function renderQRCode(container: HTMLElement, dataURL: string): void {
  container.innerHTML = `<img src="${dataURL}" alt="QR Code" class="w-full h-auto" />`;
}
