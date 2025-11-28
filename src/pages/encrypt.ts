import '../style.css';
import { compress } from '../compression';
import { generateKey, exportKey, encrypt } from '../crypto';
import { generateQRCodes, renderQRCode } from '../qrcode';

// Initialize page when DOM is ready
document.addEventListener('DOMContentLoaded', initEncryptPage);

function initEncryptPage(): void {
  const elements = getPageElements();
  if (!elements) return;

  const {
    generateBtn,
    secretsTextarea,
    qrCodesContainer,
    qrCode1Container,
    qrCode2Container,
    qrCode1Preview,
    qrCode2Preview,
    printBtn
  } = elements;

  generateBtn.addEventListener('click', () => handleGenerateClick(
    secretsTextarea,
    generateBtn,
    qrCodesContainer,
    qrCode1Container,
    qrCode2Container,
    qrCode1Preview,
    qrCode2Preview
  ));

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
}

function getPageElements() {
  const generateBtn = document.getElementById('generateBtn');
  const printBtn = document.getElementById('printBtn');
  const secretsTextarea = document.getElementById('secrets') as HTMLTextAreaElement;
  const qrCodesContainer = document.getElementById('qrCodesContainer');
  const qrCode1Container = document.getElementById('qrCode1');
  const qrCode2Container = document.getElementById('qrCode2');
  const qrCode1Preview = document.getElementById('qrCode1Preview');
  const qrCode2Preview = document.getElementById('qrCode2Preview');

  if (!generateBtn || !secretsTextarea || !qrCodesContainer ||
      !qrCode1Container || !qrCode2Container || !qrCode1Preview || !qrCode2Preview) {
    return null;
  }

  return {
    generateBtn,
    printBtn,
    secretsTextarea,
    qrCodesContainer,
    qrCode1Container,
    qrCode2Container,
    qrCode1Preview,
    qrCode2Preview
  };
}

async function handleGenerateClick(
  secretsTextarea: HTMLTextAreaElement,
  generateBtn: HTMLElement,
  qrCodesContainer: HTMLElement,
  qrCode1Container: HTMLElement,
  qrCode2Container: HTMLElement,
  qrCode1Preview: HTMLElement,
  qrCode2Preview: HTMLElement
): Promise<void> {
  const secrets = secretsTextarea.value.trim();

  if (!secrets) {
    alert('Please enter some secrets to encrypt');
    return;
  }

  setButtonLoading(generateBtn, true);

  try {
    await processAndDisplayQRCodes(
      secrets,
      qrCode1Container,
      qrCode2Container,
      qrCode1Preview,
      qrCode2Preview
    );
    showQRCodesSection(qrCodesContainer);
  } catch (error) {
    handleGenerateError(error);
  } finally {
    setButtonLoading(generateBtn, false);
  }
}

async function processAndDisplayQRCodes(
  secrets: string,
  qrCode1Container: HTMLElement,
  qrCode2Container: HTMLElement,
  qrCode1Preview: HTMLElement,
  qrCode2Preview: HTMLElement
): Promise<void> {
  const compressed = await compress(secrets);
  const key = await generateKey();
  const exportedKey = await exportKey(key);
  const encrypted = await encrypt(compressed, key);
  const { dataQR, keyQR } = await generateQRCodes(encrypted, exportedKey);

  // Render to both print containers and preview containers
  renderQRCode(qrCode1Container, dataQR);
  renderQRCode(qrCode2Container, keyQR);
  renderQRCode(qrCode1Preview, dataQR);
  renderQRCode(qrCode2Preview, keyQR);
}

function setButtonLoading(button: HTMLElement, isLoading: boolean): void {
  button.textContent = isLoading ? 'Generating...' : 'Generate QR Codes';
  if (isLoading) {
    button.setAttribute('disabled', 'true');
  } else {
    button.removeAttribute('disabled');
  }
}

function showQRCodesSection(container: HTMLElement): void {
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleGenerateError(error: unknown): void {
  console.error('Error generating QR codes:', error);
  alert('An error occurred while generating QR codes. Please try again.');
}
