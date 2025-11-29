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
 * Get a specific query parameter from the URL
 */
export function getQueryParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Get all query parameters from the URL
 */
export function getAllQueryParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Check if URL contains encrypted data or decryption key
 */
export function getQRCodeType(): 'data' | 'key' | null {
  const params = getAllQueryParams();
  if (params.has('data')) return 'data';
  if (params.has('key')) return 'key';
  return null;
}

/**
 * Build URL with query parameters for QR code
 */
export function buildQRCodeURL(type: 'data' | 'key', payload: string): string {
  const decryptURL = getDecryptPageURL();
  const params = new URLSearchParams();
  params.set(type, payload);
  return `${decryptURL}?${params.toString()}`;
}
