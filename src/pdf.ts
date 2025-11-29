/**
 * PDF generation utilities for creating printable QR code pages
 */

import { jsPDF } from 'jspdf';

export interface QRCodeData {
  dataQR: string;
  keyQR: string;
  dataOnlyQR: string;
  keyOnlyQR: string;
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

  generatePage(pdf, qrCodes.dataQR, 1);

  pdf.addPage();

  generatePage(pdf, qrCodes.keyQR, 2);

  pdf.save('secret-recovery-qr-codes.pdf');
}

function generatePage(pdf: jsPDF, qrCode: string, pageNum: number): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const centerX = pageWidth / 2;
  let yPos = 20;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Confidential Information Document', centerX, yPos, { align: 'center' });

  yPos += 8;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Part ${pageNum} of 2`, centerX, yPos, { align: 'center' });

  yPos += 12;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('What is this?', margin, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const whatIsThisText = pdf.splitTextToSize(
    'This document contains important passwords and confidential information. ' +
    'The information is split between two parts for security - both parts are needed to access it.',
    pageWidth - 2 * margin
  );
  pdf.text(whatIsThisText, margin, yPos);
  yPos += whatIsThisText.length * 4.5 + 8;

  const qrSize = 100;
  const qrX = centerX - qrSize / 2;
  pdf.addImage(qrCode, 'PNG', qrX, yPos, qrSize, qrSize);
  yPos += qrSize + 12;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('How to access the information:', margin, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  const instructions = [
    '1. Open your phone camera and point it at the QR code above',
    '2. Tap the notification to open the website',
    '3. The website will ask you to scan the second QR code',
    '4. Get the other part of this document and scan its QR code',
    '5. The information will be displayed on the screen'
  ];

  instructions.forEach(line => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });

  yPos += 6;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Important: Both parts are required!', margin, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const importantText = pdf.splitTextToSize(
    'This part and the other part must be kept in different locations. Both parts are required to access the information.',
    pageWidth - 2 * margin
  );
  pdf.text(importantText, margin, yPos);
  yPos += importantText.length * 4.5 + 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('The other QR code is located at:', margin, yPos);

  yPos += 6;
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 15);

  yPos += 22;
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const technicalNote = pdf.splitTextToSize(
    'Technical details: Data encrypted with AES-256-GCM (IV: first 12 bytes), compressed with gzip, encoded in base64. ' +
    'One QR contains the encrypted data, the other contains the encryption key.',
    pageWidth - 2 * margin
  );
  pdf.text(technicalNote, margin, yPos);

  pdf.setTextColor(0, 0, 0);
}
