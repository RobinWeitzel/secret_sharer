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
  const baseURL = window.location.origin + window.location.pathname.replace(/\/encrypt$/, '');
  const params = new URLSearchParams();
  params.set(type, payload);
  return `${baseURL}?${params.toString()}`;
}
