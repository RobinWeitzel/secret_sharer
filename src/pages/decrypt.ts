import { importKey, decrypt } from '../crypto';
import { decompress } from '../compression';
import { getQueryParam } from '../utils';
import { registerServiceWorker, storeData, storeKey, getAll, clearStorage } from '../serviceWorker';

interface DecryptState {
  encryptedData: string | null;
  encryptionKey: string | null;
}

const state: DecryptState = {
  encryptedData: null,
  encryptionKey: null,
};

document.addEventListener('DOMContentLoaded', initDecryptPage);

async function initDecryptPage(): Promise<void> {
  await registerServiceWorker();
  await loadDataFromUrlAndServiceWorker();
  updateUI();
}

async function loadDataFromUrlAndServiceWorker(): Promise<void> {
  const urlData = getQueryParam('data');
  const urlKey = getQueryParam('key');

  if (urlData) {
    state.encryptedData = urlData;
    await storeData(urlData);
  }

  if (urlKey) {
    state.encryptionKey = urlKey;
    await storeKey(urlKey);
  }

  const stored = await getAll();

  if (!state.encryptedData && stored.data) {
    state.encryptedData = stored.data;
  }

  if (!state.encryptionKey && stored.key) {
    state.encryptionKey = stored.key;
  }
}

function updateUI(): void {
  const statusContainer = document.getElementById('statusContainer');
  const instructionsContainer = document.getElementById('instructionsContainer');

  const hasData = !!state.encryptedData;
  const hasKey = !!state.encryptionKey;

  if (hasData && hasKey) {
    statusContainer?.classList.add('hidden');
    instructionsContainer?.classList.add('hidden');
    decryptAndDisplay();
  } else if (hasData) {
    updateStatus('Encrypted data received. Please scan the decryption key QR code with your camera app.', 'blue');
    instructionsContainer?.classList.remove('hidden');
  } else if (hasKey) {
    updateStatus('Decryption key received. Please scan the encrypted data QR code with your camera app.', 'blue');
    instructionsContainer?.classList.remove('hidden');
  } else {
    updateStatus('Please scan the first QR code using your camera app to begin.', 'blue');
    instructionsContainer?.classList.add('hidden');
  }
}

function updateStatus(message: string, color: 'blue' | 'red'): void {
  const statusText = document.getElementById('statusText');
  const statusContainer = document.getElementById('statusContainer');

  if (!statusText || !statusContainer) return;

  statusText.textContent = message;

  if (color === 'blue') {
    statusContainer.classList.remove('bg-red-50', 'border-red-200');
    statusContainer.classList.add('bg-blue-50', 'border-blue-200');
    statusText.classList.remove('text-red-700');
    statusText.classList.add('text-blue-700');
  } else {
    statusContainer.classList.remove('bg-blue-50', 'border-blue-200');
    statusContainer.classList.add('bg-red-50', 'border-red-200');
    statusText.classList.remove('text-blue-700');
    statusText.classList.add('text-red-700');
  }
}

async function decryptAndDisplay(): Promise<void> {
  if (!state.encryptedData || !state.encryptionKey) return;

  const statusContainer = document.getElementById('statusContainer');
  const secretsContainer = document.getElementById('secretsContainer');
  const secretsDisplay = document.getElementById('secretsDisplay');
  const copyBtn = document.getElementById('copyBtn');

  updateStatus('Decrypting...', 'blue');

  try {
    const key = await importKey(state.encryptionKey);
    const decrypted = await decrypt(state.encryptedData, key);
    const decompressed = await decompress(decrypted);

    if (secretsDisplay) {
      secretsDisplay.textContent = decompressed;
    }

    await clearStorage();

    statusContainer?.classList.add('hidden');
    secretsContainer?.classList.remove('hidden');

    if (copyBtn) {
      copyBtn.addEventListener('click', handleCopy);
    }
  } catch (error) {
    console.error('Decryption error:', error);
    updateStatus('Error decrypting data. Please ensure both QR codes are from the same set.', 'red');
  }
}

async function handleCopy(): Promise<void> {
  const secretsDisplay = document.getElementById('secretsDisplay');
  const copyBtn = document.getElementById('copyBtn');

  if (!secretsDisplay || !copyBtn) return;

  try {
    await navigator.clipboard.writeText(secretsDisplay.textContent || '');

    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Copied!
    `;

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
    alert('Failed to copy to clipboard');
  }
}
