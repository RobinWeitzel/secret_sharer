/**
 * PDF generation utilities for creating printable QR code pages
 */

import { jsPDF } from 'jspdf';

const PDF_MARGIN = 20;
const QR_SIZE_MM = 80;
const SECURITY_BOX_HEIGHT = 20;
const SECURITY_BOX_BORDER_RADIUS = 3;
const SECURITY_BOX_BORDER_WIDTH = 1;
const SECURITY_BOX_COLOR_FILL = [255, 250, 205] as const;
const SECURITY_BOX_COLOR_BORDER = [200, 180, 100] as const;
const EMPTY_BOX_HEIGHT = 15;
const EMPTY_BOX_BORDER_WIDTH = 0.5;

export interface QRCodeData {
  dataQR: string;
  keyQR: string;
  dataOnlyQR: string;
  keyOnlyQR: string;
}

/**
 * Generate a 2-page PDF with QR codes and instructions
 */
export function generatePDF(qrCodes: QRCodeData, securityCode: string): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  generatePage(pdf, qrCodes.dataQR, 1, securityCode);

  pdf.addPage();

  generatePage(pdf, qrCodes.keyQR, 2, securityCode);

  pdf.save('secret-recovery-qr-codes.pdf');
}

function generatePage(pdf: jsPDF, qrCode: string, pageNum: number, securityCode: string): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  let yPos = PDF_MARGIN;

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
  pdf.text('What is this?', PDF_MARGIN, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const whatIsThisText = pdf.splitTextToSize(
    'This document contains important passwords and confidential information. ' +
    'The information is split between two parts for security - both parts are needed to access it.',
    pageWidth - 2 * PDF_MARGIN
  );
  pdf.text(whatIsThisText, PDF_MARGIN, yPos);
  yPos += whatIsThisText.length * 4.5 + 8;

  const qrX = centerX - QR_SIZE_MM / 2;
  pdf.addImage(qrCode, 'PNG', qrX, yPos, QR_SIZE_MM, QR_SIZE_MM);
  yPos += QR_SIZE_MM + 10;

  pdf.setFillColor(...SECURITY_BOX_COLOR_FILL);
  pdf.setDrawColor(...SECURITY_BOX_COLOR_BORDER);
  pdf.setLineWidth(SECURITY_BOX_BORDER_WIDTH);
  const boxWidth = pageWidth - 2 * PDF_MARGIN;
  pdf.roundedRect(PDF_MARGIN, yPos, boxWidth, SECURITY_BOX_HEIGHT, SECURITY_BOX_BORDER_RADIUS, SECURITY_BOX_BORDER_RADIUS, 'FD');

  yPos += 6;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SECURITY CODE:', centerX, yPos, { align: 'center' });

  yPos += 7;
  pdf.setFontSize(16);
  pdf.setFont('courier', 'bold');
  pdf.text(securityCode, centerX, yPos, { align: 'center' });

  yPos += 18;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('How to access the information:', PDF_MARGIN, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  const instructions = [
    '1. Open your phone camera and point it at the QR code above',
    '2. Tap the notification to open the website',
    '3. The website will ask you to scan the second QR code',
    '4. Get the other part of this document and scan its QR code',
    '5. Enter the security code shown above when prompted',
    '6. The information will be displayed on the screen'
  ];

  instructions.forEach(line => {
    pdf.text(line, PDF_MARGIN + 5, yPos);
    yPos += 5;
  });

  yPos += 6;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Important: Both parts and the security code are required!', PDF_MARGIN, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const importantText = pdf.splitTextToSize(
    'This part and the other part must be kept in different locations. Both parts and the security code (printed above) are required to access the information.',
    pageWidth - 2 * PDF_MARGIN
  );
  pdf.text(importantText, PDF_MARGIN, yPos);
  yPos += importantText.length * 4.5 + 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('The other QR code is located at:', PDF_MARGIN, yPos);

  yPos += 6;
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(EMPTY_BOX_BORDER_WIDTH);
  pdf.rect(PDF_MARGIN, yPos, pageWidth - 2 * PDF_MARGIN, EMPTY_BOX_HEIGHT);

  yPos += 22;
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const technicalNote = pdf.splitTextToSize(
    'Technical details: Data encrypted with AES-256-GCM (IV: first 12 bytes), compressed with gzip, encoded in base64. ' +
    'One QR contains the encrypted data, the other contains the base encryption key. The security code is combined with ' +
    'the base key to derive the final encryption key.',
    pageWidth - 2 * PDF_MARGIN
  );
  pdf.text(technicalNote, PDF_MARGIN, yPos);

  pdf.setTextColor(0, 0, 0);
}
