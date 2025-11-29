import { Html5Qrcode } from 'html5-qrcode';
import { importKey, decrypt } from '../crypto';
import { decompress } from '../compression';
import { getQueryParam } from '../utils';

interface DecryptState {
  encryptedData: string | null;
  encryptionKey: string | null;
  scanner: Html5Qrcode | null;
  isScanning: boolean;
}

const state: DecryptState = {
  encryptedData: null,
  encryptionKey: null,
  scanner: null,
  isScanning: false,
};

document.addEventListener('DOMContentLoaded', initDecryptPage);

function initDecryptPage(): void {
  checkQueryParams();
  setupEventListeners();
  updateStatus();
}

function checkQueryParams(): void {
  const data = getQueryParam('data');
  const key = getQueryParam('key');

  if (data) {
    state.encryptedData = data;
  }

  if (key) {
    state.encryptionKey = key;
  }
}

function setupEventListeners(): void {
  const startBtn = document.getElementById('startScanBtn');
  const stopBtn = document.getElementById('stopScanBtn');
  const copyBtn = document.getElementById('copyBtn');

  startBtn?.addEventListener('click', handleStartScan);
  stopBtn?.addEventListener('click', handleStopScan);
  copyBtn?.addEventListener('click', handleCopy);
}

function updateStatus(): void {
  const statusText = document.getElementById('statusText');
  if (!statusText) return;

  const hasData = !!state.encryptedData;
  const hasKey = !!state.encryptionKey;

  if (hasData && hasKey) {
    statusText.textContent = 'Both QR codes received! Decrypting...';
    decryptAndDisplay();
  } else if (hasData) {
    statusText.textContent = 'Encrypted data received. Please scan the decryption key QR code.';
  } else if (hasKey) {
    statusText.textContent = 'Decryption key received. Please scan the encrypted data QR code.';
  } else {
    statusText.textContent = 'Please scan the first QR code to begin.';
  }
}

async function handleStartScan(): Promise<void> {
  const qrReader = document.getElementById('qrReader');
  const startBtn = document.getElementById('startScanBtn');
  const stopBtn = document.getElementById('stopScanBtn');

  if (!qrReader || !startBtn || !stopBtn) return;

  try {
    state.scanner = new Html5Qrcode('qrReader');

    await state.scanner.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanError
    );

    state.isScanning = true;
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
  } catch (error) {
    console.error('Error starting camera:', error);
    alert('Failed to start camera. Please ensure camera permissions are granted.');
  }
}

async function handleStopScan(): Promise<void> {
  const startBtn = document.getElementById('startScanBtn');
  const stopBtn = document.getElementById('stopScanBtn');

  if (!state.scanner || !state.isScanning) return;

  try {
    await state.scanner.stop();
    state.scanner.clear();
    state.isScanning = false;

    startBtn?.classList.remove('hidden');
    stopBtn?.classList.add('hidden');
  } catch (error) {
    console.error('Error stopping camera:', error);
  }
}

function onScanSuccess(decodedText: string): void {
  try {
    const url = new URL(decodedText);
    const params = new URLSearchParams(url.search);

    const data = params.get('data');
    const key = params.get('key');

    let updated = false;

    if (data && !state.encryptedData) {
      state.encryptedData = data;
      updated = true;
    }

    if (key && !state.encryptionKey) {
      state.encryptionKey = key;
      updated = true;
    }

    if (updated) {
      updateStatus();

      if (state.encryptedData && state.encryptionKey) {
        handleStopScan();
      }
    }
  } catch (error) {
    console.error('Invalid QR code format:', error);
  }
}

function onScanError(_errorMessage: string): void {
  // Ignore scan errors as they happen frequently during scanning
}

async function decryptAndDisplay(): Promise<void> {
  if (!state.encryptedData || !state.encryptionKey) return;

  const scannerContainer = document.getElementById('scannerContainer');
  const secretsContainer = document.getElementById('secretsContainer');
  const secretsDisplay = document.getElementById('secretsDisplay');
  const statusContainer = document.getElementById('statusContainer');

  try {
    const key = await importKey(state.encryptionKey);
    const decrypted = await decrypt(state.encryptedData, key);
    const decompressed = await decompress(decrypted);

    if (secretsDisplay) {
      secretsDisplay.textContent = decompressed;
    }

    scannerContainer?.classList.add('hidden');
    statusContainer?.classList.add('hidden');
    secretsContainer?.classList.remove('hidden');
  } catch (error) {
    console.error('Decryption error:', error);
    const statusText = document.getElementById('statusText');
    if (statusText) {
      statusText.textContent = 'Error decrypting data. Please ensure both QR codes are from the same set.';
      const statusContainer = statusText.closest('.bg-blue-50');
      statusContainer?.classList.remove('bg-blue-50', 'border-blue-200');
      statusContainer?.classList.add('bg-red-50', 'border-red-200');
      statusText.classList.remove('text-blue-700');
      statusText.classList.add('text-red-700');
    }
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
