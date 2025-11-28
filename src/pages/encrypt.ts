import { createLayout } from '../layout';

export function renderEncryptPage(): string {
  const content = `
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Encrypt Your Secrets</h2>
        <p class="text-gray-600 mb-8">
          Enter your sensitive information below. We'll generate two QR codes that must be combined to reveal the secrets.
          Print them separately and store them in different secure locations.
        </p>

        <div class="space-y-6">
          <div>
            <label for="secrets" class="block text-sm font-medium text-gray-700 mb-2">
              Your Secrets
            </label>
            <textarea
              id="secrets"
              rows="10"
              class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your passwords, account numbers, or other sensitive information here...&#10;&#10;Example:&#10;Bank Account: 1234567890&#10;Password: mySecretPassword123&#10;PIN: 5678"
            ></textarea>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">How it works</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <p>Your secrets will be encrypted using state-of-the-art encryption. One QR code contains the encrypted data, the other contains the decryption key. Both are required to access your secrets.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            id="generateBtn"
            class="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate QR Codes
          </button>
        </div>

        <div id="qrCodesContainer" class="hidden mt-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Your QR Codes</h3>
          <p class="text-gray-600 mb-6">
            Print these two pages and store them in different secure locations.
          </p>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="border-2 border-gray-300 rounded-lg p-6 text-center">
              <h4 class="font-semibold text-gray-700 mb-4">QR Code 1 - Encrypted Data</h4>
              <div id="qrCode1" class="bg-gray-100 h-64 flex items-center justify-center">
                <p class="text-gray-500">QR Code will appear here</p>
              </div>
            </div>
            <div class="border-2 border-gray-300 rounded-lg p-6 text-center">
              <h4 class="font-semibold text-gray-700 mb-4">QR Code 2 - Decryption Key</h4>
              <div id="qrCode2" class="bg-gray-100 h-64 flex items-center justify-center">
                <p class="text-gray-500">QR Code will appear here</p>
              </div>
            </div>
          </div>
          <button
            id="printBtn"
            class="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
          >
            Print QR Codes
          </button>
        </div>
      </div>
    </div>
  `;

  return createLayout(content, '/encrypt');
}
