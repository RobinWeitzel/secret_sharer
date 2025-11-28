import { createLayout } from '../layout';

export function renderDecryptPage(): string {
  const content = `
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Decrypt Your Secrets</h2>
        <p class="text-gray-600 mb-8">
          Scan both QR codes to reveal your encrypted secrets. You can scan them using your camera or upload images of the QR codes.
        </p>

        <div id="scanningSection" class="space-y-6">
          <div class="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-amber-800">Important</h3>
                <div class="mt-2 text-sm text-amber-700">
                  <p>Both QR codes are required to decrypt your secrets. The process happens entirely in your browser - no data is sent to any server.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">First QR Code</h3>
                <p class="mt-1 text-xs text-gray-500" id="qr1Status">Not scanned</p>
                <button
                  id="scanQR1Btn"
                  class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
                >
                  Scan QR Code 1
                </button>
              </div>
            </div>

            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Second QR Code</h3>
                <p class="mt-1 text-xs text-gray-500" id="qr2Status">Not scanned</p>
                <button
                  id="scanQR2Btn"
                  class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
                  disabled
                >
                  Scan QR Code 2
                </button>
              </div>
            </div>
          </div>

          <button
            id="decryptBtn"
            class="w-full bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled
          >
            Decrypt Secrets
          </button>
        </div>

        <div id="resultsSection" class="hidden mt-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Decrypted Secrets</h3>
          <div class="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">Successfully decrypted!</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-md p-6">
            <pre id="decryptedContent" class="whitespace-pre-wrap font-mono text-sm text-gray-800"></pre>
          </div>
          <button
            id="copyBtn"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  `;

  return createLayout(content, '/');
}
