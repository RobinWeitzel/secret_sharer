import { importKey, decrypt } from '../crypto';
import { decompress } from '../compression';
import { getFragmentParam } from '../utils';
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
  const urlData = getFragmentParam('data');
  const urlKey = getFragmentParam('key');

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
  const hasData = !!state.encryptedData;
  const hasKey = !!state.encryptionKey;

  if (hasData && hasKey) {
    showStep(3);
    setupDecryptButton();
  } else if (hasData) {
    showStep(2);
    updateStepMessage('First part received. Now scan the QR code from the other document.', 'Scan the QR code from the other part of the document to access the information.');
  } else if (hasKey) {
    showStep(2);
    updateStepMessage('First part received. Now scan the QR code from the other document.', 'Scan the QR code from the other part of the document to access the information.');
  } else {
    showStep(1);
  }
}

function setupDecryptButton(): void {
  const decryptBtn = document.getElementById('decryptBtn');
  const securityCodeInput = document.getElementById('securityCodeInput') as HTMLInputElement;

  if (decryptBtn && securityCodeInput) {
    decryptBtn.addEventListener('click', () => handleDecryptClick(securityCodeInput));
    securityCodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleDecryptClick(securityCodeInput);
      }
    });
  }
}

async function handleDecryptClick(securityCodeInput: HTMLInputElement): Promise<void> {
  const securityCode = securityCodeInput.value.trim();

  if (securityCode.length !== 8) {
    alert('Please enter the 8-character security code');
    return;
  }

  showStep(4);
  await decryptAndDisplay(securityCode);
}

function showStep(step: number): void {
  const step1Content = document.getElementById('step1Content');
  const step2Content = document.getElementById('step2Content');
  const step3Content = document.getElementById('step3Content');
  const step4Content = document.getElementById('step4Content');
  const secretsContainer = document.getElementById('secretsContainer');
  const errorContainer = document.getElementById('errorContainer');

  step1Content?.classList.add('hidden');
  step2Content?.classList.add('hidden');
  step3Content?.classList.add('hidden');
  step4Content?.classList.add('hidden');
  secretsContainer?.classList.add('hidden');
  errorContainer?.classList.add('hidden');

  if (step === 1) {
    step1Content?.classList.remove('hidden');
    updateProgress(1, 'active');
  } else if (step === 2) {
    step2Content?.classList.remove('hidden');
    updateProgress(1, 'complete');
    updateProgress(2, 'active');
  } else if (step === 3) {
    step3Content?.classList.remove('hidden');
    updateProgress(1, 'complete');
    updateProgress(2, 'complete');
    updateProgress(3, 'active');
  } else if (step === 4) {
    step4Content?.classList.remove('hidden');
    updateProgress(1, 'complete');
    updateProgress(2, 'complete');
    updateProgress(3, 'active');
  }
}

function updateProgress(step: number, status: 'active' | 'complete'): void {
  const stepElement = document.getElementById(`step${step}`);
  const progressBar = document.getElementById(`progress${step}`)?.querySelector('div');

  if (!stepElement) return;

  const circle = stepElement.querySelector('div');
  const text = stepElement.querySelector('p');

  if (status === 'complete') {
    circle?.classList.remove('bg-gray-300', 'bg-blue-600');
    circle?.classList.add('bg-green-600');
    circle?.classList.remove('text-gray-600');
    circle?.classList.add('text-white');
    text?.classList.remove('text-gray-500');
    text?.classList.add('text-gray-900');
    progressBar?.style.setProperty('width', '100%');
  } else if (status === 'active') {
    circle?.classList.remove('bg-gray-300');
    circle?.classList.add('bg-blue-600', 'text-white');
    text?.classList.remove('text-gray-500');
    text?.classList.add('text-gray-900');
  }

  updateProgressBarColors();
}

function updateProgressBarColors(): void {
  const step1Complete = document.getElementById('step1')?.querySelector('div')?.classList.contains('bg-green-600');
  const step2Complete = document.getElementById('step2')?.querySelector('div')?.classList.contains('bg-green-600');
  const step3Complete = document.getElementById('step3')?.querySelector('div')?.classList.contains('bg-green-600');

  const progress1Bar = document.getElementById('progress1')?.querySelector('div');
  const progress2Bar = document.getElementById('progress2')?.querySelector('div');

  if (step1Complete && step2Complete) {
    progress1Bar?.classList.remove('bg-blue-600');
    progress1Bar?.classList.add('bg-green-600');
  }

  if (step2Complete && step3Complete) {
    progress2Bar?.classList.remove('bg-blue-600');
    progress2Bar?.classList.add('bg-green-600');
  }
}

function updateStepMessage(message: string, instruction: string): void {
  const step2Message = document.getElementById('step2Message');
  const step2Instruction = document.getElementById('step2Instruction');

  if (step2Message) step2Message.textContent = message;
  if (step2Instruction) step2Instruction.textContent = instruction;
}

async function decryptAndDisplay(securityCode: string): Promise<void> {
  if (!state.encryptedData || !state.encryptionKey) return;

  const step4Content = document.getElementById('step4Content');
  const secretsContainer = document.getElementById('secretsContainer');
  const secretsDisplay = document.getElementById('secretsDisplay');
  const copyBtn = document.getElementById('copyBtn');

  try {
    const key = await importKey(state.encryptionKey);
    const decrypted = await decrypt(state.encryptedData, key, securityCode);
    const decompressed = await decompress(decrypted);

    if (secretsDisplay) {
      secretsDisplay.textContent = decompressed;
    }

    await clearStorage();

    step4Content?.classList.add('hidden');
    updateProgress(3, 'complete');
    secretsContainer?.classList.remove('hidden');

    if (copyBtn) {
      copyBtn.addEventListener('click', handleCopy);
    }
  } catch (error) {
    console.error('Decryption error:', error);
    showError('Error decrypting the information. Please ensure both QR codes are from the same document set and that you entered the correct security code.');
  }
}

async function showError(message: string): Promise<void> {
  const step3Content = document.getElementById('step3Content');
  const step4Content = document.getElementById('step4Content');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');

  await clearStorage();
  state.encryptedData = null;
  state.encryptionKey = null;

  step3Content?.classList.add('hidden');
  step4Content?.classList.add('hidden');
  errorContainer?.classList.remove('hidden');

  if (errorMessage) {
    errorMessage.textContent = `${message} The stored data has been cleared. Please scan both QR codes again.`;
  }

  const step1Element = document.getElementById('step1');
  const step2Element = document.getElementById('step2');
  const step3Element = document.getElementById('step3');

  step1Element?.querySelector('div')?.classList.remove('bg-green-600', 'bg-blue-600');
  step1Element?.querySelector('div')?.classList.add('bg-gray-300', 'text-gray-600');
  step1Element?.querySelector('p')?.classList.remove('text-gray-900');
  step1Element?.querySelector('p')?.classList.add('text-gray-500');

  step2Element?.querySelector('div')?.classList.remove('bg-green-600', 'bg-blue-600');
  step2Element?.querySelector('div')?.classList.add('bg-gray-300', 'text-gray-600');
  step2Element?.querySelector('p')?.classList.remove('text-gray-900');
  step2Element?.querySelector('p')?.classList.add('text-gray-500');

  step3Element?.querySelector('div')?.classList.remove('bg-green-600', 'bg-blue-600');
  step3Element?.querySelector('div')?.classList.add('bg-gray-300', 'text-gray-600');
  step3Element?.querySelector('p')?.classList.remove('text-gray-900');
  step3Element?.querySelector('p')?.classList.add('text-gray-500');

  const progress1Bar = document.getElementById('progress1')?.querySelector('div');
  const progress2Bar = document.getElementById('progress2')?.querySelector('div');

  progress1Bar?.style.setProperty('width', '0%');
  progress1Bar?.classList.remove('bg-green-600');
  progress1Bar?.classList.add('bg-blue-600');

  progress2Bar?.style.setProperty('width', '0%');
  progress2Bar?.classList.remove('bg-green-600');
  progress2Bar?.classList.add('bg-blue-600');
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
