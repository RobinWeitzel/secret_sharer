/**
 * Browser compatibility detection for required Web APIs
 */

export interface CompatibilityResult {
  compatible: boolean;
  missingFeatures: string[];
}

/**
 * Check if all required browser features are supported
 */
export function checkBrowserCompatibility(): CompatibilityResult {
  const missingFeatures: string[] = [];

  // Check for Web Crypto API
  if (!window.crypto || !window.crypto.subtle) {
    missingFeatures.push('Web Crypto API');
  }

  // Check for CompressionStream (for gzip compression)
  if (typeof CompressionStream === 'undefined') {
    missingFeatures.push('CompressionStream API');
  }

  // Check for DecompressionStream (for gzip decompression)
  if (typeof DecompressionStream === 'undefined') {
    missingFeatures.push('DecompressionStream API');
  }

  // Check for TextEncoder/TextDecoder
  if (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined') {
    missingFeatures.push('TextEncoder/TextDecoder');
  }

  // Check for Service Worker support
  if (!('serviceWorker' in navigator)) {
    missingFeatures.push('Service Worker');
  }

  // Check for Clipboard API (optional, but good to have)
  if (!navigator.clipboard) {
    missingFeatures.push('Clipboard API (copying will not work)');
  }

  return {
    compatible: missingFeatures.length === 0,
    missingFeatures,
  };
}

/**
 * Show a user-friendly error message for incompatible browsers
 */
export function showCompatibilityError(missingFeatures: string[]): void {
  const errorHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom right, #fee, #fdd);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
      ">
        <h1 style="
          color: #dc2626;
          margin: 0 0 20px 0;
          font-size: 24px;
          font-family: system-ui, -apple-system, sans-serif;
        ">Browser Not Supported</h1>

        <p style="
          color: #374151;
          margin: 0 0 16px 0;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.6;
        ">
          Your browser doesn't support the following features required by Secret Sharer:
        </p>

        <ul style="
          color: #6b7280;
          margin: 0 0 20px 20px;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.8;
        ">
          ${missingFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>

        <p style="
          color: #374151;
          margin: 0 0 20px 0;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.6;
        ">
          Please use one of the following modern browsers:
        </p>

        <ul style="
          color: #6b7280;
          margin: 0 0 20px 20px;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.8;
        ">
          <li>Chrome 80+</li>
          <li>Firefox 90+</li>
          <li>Safari 16.4+</li>
          <li>Edge 80+</li>
        </ul>

        <p style="
          color: #9ca3af;
          margin: 0;
          font-size: 14px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          This application requires modern browser features for secure encryption and compression.
        </p>
      </div>
    </div>
  `;

  document.body.innerHTML = errorHTML;
}
