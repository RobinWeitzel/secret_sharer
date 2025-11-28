/**
 * PDF generation utilities for creating printable QR code pages
 */

import { jsPDF } from 'jspdf';

export interface QRCodeData {
  dataQR: string;
  keyQR: string;
}

/**
 * Generate a 2-page PDF with QR codes and instructions
 */
export function generatePDF(qrCodes: QRCodeData): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page 1 - Encrypted Data
  generatePage1(pdf, qrCodes.dataQR);

  // Add second page
  pdf.addPage();

  // Page 2 - Decryption Key
  generatePage2(pdf, qrCodes.keyQR);

  // Download the PDF
  pdf.save('secret-recovery-qr-codes.pdf');
}

function generatePage1(pdf: jsPDF, qrDataURL: string): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Secret Recovery - Part 1 of 2', pageWidth / 2, 30, { align: 'center' });

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('ENCRYPTED DATA', pageWidth / 2, 42, { align: 'center' });

  // Horizontal line
  pdf.setLineWidth(0.5);
  pdf.line(margin, 48, pageWidth - margin, 48);

  // QR Code
  const qrSize = 100;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 60;
  pdf.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

  // Instructions
  let yPos = qrY + qrSize + 20;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Instructions:', margin, yPos);

  yPos += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const instructions = [
    '1. Open the camera app on your smartphone',
    '2. Point your camera at the QR code above',
    '3. Tap the notification that appears to open the website',
    '4. The website will ask you to scan Part 2',
    '5. Locate Part 2 (stored in a different location)',
    '6. Scan the QR code on Part 2',
    '7. Your secrets will be displayed',
  ];

  instructions.forEach((instruction) => {
    pdf.text(instruction, margin + 5, yPos);
    yPos += 7;
  });

  // Warning box
  yPos += 5;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 35, 'F');
  pdf.setLineWidth(0.3);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 35);

  yPos += 8;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IMPORTANT:', margin + 5, yPos);

  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text('This page alone cannot reveal your secrets. Both Part 1 and Part 2', margin + 5, yPos);
  yPos += 5;
  pdf.text('are required.', margin + 5, yPos);

  yPos += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Storage:', margin + 5, yPos);

  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Keep this page and Part 2 in separate secure locations (e.g., one at', margin + 5, yPos);
  yPos += 5;
  pdf.text('home, one with a trusted family member).', margin + 5, yPos);
}

function generatePage2(pdf: jsPDF, qrDataURL: string): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Secret Recovery - Part 2 of 2', pageWidth / 2, 30, { align: 'center' });

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('DECRYPTION KEY', pageWidth / 2, 42, { align: 'center' });

  // Horizontal line
  pdf.setLineWidth(0.5);
  pdf.line(margin, 48, pageWidth - margin, 48);

  // QR Code
  const qrSize = 100;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 60;
  pdf.addImage(qrDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

  // Instructions
  let yPos = qrY + qrSize + 20;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Instructions:', margin, yPos);

  yPos += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const instructions = [
    '1. First, locate Part 1 (stored in a different location)',
    '2. Open the camera app on your smartphone',
    '3. Point your camera at the QR code on Part 1',
    '4. Tap the notification to open the website',
    '5. The website will ask you to scan Part 2',
    '6. Point your camera at the QR code above',
    '7. Your secrets will be displayed',
  ];

  instructions.forEach((instruction) => {
    pdf.text(instruction, margin + 5, yPos);
    yPos += 7;
  });

  // Warning box
  yPos += 5;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 35, 'F');
  pdf.setLineWidth(0.3);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 35);

  yPos += 8;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IMPORTANT:', margin + 5, yPos);

  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text('This page alone cannot reveal your secrets. Both Part 1 and Part 2', margin + 5, yPos);
  yPos += 5;
  pdf.text('are required.', margin + 5, yPos);

  yPos += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Storage:', margin + 5, yPos);

  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Keep this page and Part 1 in separate secure locations (e.g., one at', margin + 5, yPos);
  yPos += 5;
  pdf.text('home, one with a trusted family member).', margin + 5, yPos);
}
