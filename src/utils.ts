/**
 * Get the current base URL from the browser
 */
export function getBaseURL(): string {
  const { protocol, host, pathname } = window.location;
  const path = pathname.endsWith('.html')
    ? pathname.substring(0, pathname.lastIndexOf('/'))
    : pathname.replace(/\/$/, '');
  return `${protocol}//${host}${path}`;
}

/**
 * Get the URL for the decrypt page
 */
export function getDecryptPageURL(): string {
  const baseURL = getBaseURL();
  return `${baseURL}/decrypt.html`;
}

/**
 * Get a specific parameter from the URI fragment
 */
export function getFragmentParam(param: string): string | null {
  const hash = window.location.hash.substring(1);
  const urlParams = new URLSearchParams(hash);
  return urlParams.get(param);
}

/**
 * Get all parameters from the URI fragment
 */
export function getAllFragmentParams(): URLSearchParams {
  const hash = window.location.hash.substring(1);
  return new URLSearchParams(hash);
}

/**
 * Check if URL contains encrypted data or decryption key
 */
export function getQRCodeType(): 'data' | 'key' | null {
  const params = getAllFragmentParams();
  if (params.has('data')) return 'data';
  if (params.has('key')) return 'key';
  return null;
}

/**
 * Build URL with URI fragment for QR code
 */
export function buildQRCodeURL(type: 'data' | 'key', payload: string): string {
  const decryptURL = getDecryptPageURL();
  const params = new URLSearchParams();
  params.set(type, payload);
  return `${decryptURL}#${params.toString()}`;
}
