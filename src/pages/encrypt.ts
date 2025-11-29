import { compress } from '../compression';
import { generateKey, exportKey, encrypt, generateSecurityCode } from '../crypto';
import { generateQRCodeSet, renderQRCode } from '../qrcode';
import { generatePDF } from '../pdf';

// Store QR codes and security code for PDF generation
let currentQRCodes: { dataQR: string; keyQR: string; dataOnlyQR: string; keyOnlyQR: string } | null = null;
let currentSecurityCode: string | null = null;

// Initialize page when DOM is ready
document.addEventListener('DOMContentLoaded', initEncryptPage);

function initEncryptPage(): void {
  const elements = getPageElements();
  if (!elements) return;

  const {
    generateBtn,
    secretsTextarea,
    qrCodesContainer,
    qrCode1Preview,
    qrCode2Preview,
    securityCodeDisplay,
    downloadBtn
  } = elements;

  generateBtn.addEventListener('click', () => handleGenerateClick(
    secretsTextarea,
    generateBtn,
    qrCodesContainer,
    qrCode1Preview,
    qrCode2Preview,
    securityCodeDisplay
  ));

  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownloadClick);
  }
}

function getPageElements() {
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const secretsTextarea = document.getElementById('secrets') as HTMLTextAreaElement;
  const qrCodesContainer = document.getElementById('qrCodesContainer');
  const qrCode1Preview = document.getElementById('qrCode1Preview');
  const qrCode2Preview = document.getElementById('qrCode2Preview');
  const securityCodeDisplay = document.getElementById('securityCodeDisplay');

  if (!generateBtn || !secretsTextarea || !qrCodesContainer || !qrCode1Preview || !qrCode2Preview || !securityCodeDisplay) {
    return null;
  }

  return {
    generateBtn,
    downloadBtn,
    secretsTextarea,
    qrCodesContainer,
    qrCode1Preview,
    qrCode2Preview,
    securityCodeDisplay
  };
}

async function handleGenerateClick(
  secretsTextarea: HTMLTextAreaElement,
  generateBtn: HTMLElement,
  qrCodesContainer: HTMLElement,
  qrCode1Preview: HTMLElement,
  qrCode2Preview: HTMLElement,
  securityCodeDisplay: HTMLElement
): Promise<void> {
  const secrets = secretsTextarea.value.trim();

  if (!secrets) {
    alert('Please enter some secrets to encrypt');
    return;
  }

  setButtonLoading(generateBtn, true);

  try {
    await processAndDisplayQRCodes(secrets, qrCode1Preview, qrCode2Preview, securityCodeDisplay);
    showQRCodesSection(qrCodesContainer);
  } catch (error) {
    handleGenerateError(error);
  } finally {
    setButtonLoading(generateBtn, false);
  }
}

function handleDownloadClick(): void {
  if (!currentQRCodes || !currentSecurityCode) {
    alert('Please generate QR codes first');
    return;
  }

  generatePDF(currentQRCodes, currentSecurityCode);
}

async function processAndDisplayQRCodes(
  secrets: string,
  qrCode1Preview: HTMLElement,
  qrCode2Preview: HTMLElement,
  securityCodeDisplay: HTMLElement
): Promise<void> {
  const compressed = await compress(secrets);
  const key = await generateKey();
  const securityCode = generateSecurityCode();
  const exportedKey = await exportKey(key);
  const encrypted = await encrypt(compressed, key, securityCode);
  const qrCodeSet = await generateQRCodeSet(encrypted, exportedKey);

  // Store for PDF generation
  currentQRCodes = qrCodeSet;
  currentSecurityCode = securityCode;

  // Display security code
  securityCodeDisplay.textContent = securityCode;

  // Render preview (only show the URL versions)
  renderQRCode(qrCode1Preview, qrCodeSet.dataQR);
  renderQRCode(qrCode2Preview, qrCodeSet.keyQR);
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
