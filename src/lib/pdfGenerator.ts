import jsPDF from 'jspdf';
import { ChequeRecord, ChequeLayout } from './storage';

// Convert pixels to mm (assuming 96 DPI)
const pxToMm = (px: number) => px * 0.264583;

export async function generateChequePDF(
  cheque: ChequeRecord,
  layout: ChequeLayout,
  backgroundImage?: string
): Promise<jsPDF> {
  // Standard cheque size in mm (approximately 8.5" x 3.5")
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [88.9, 215.9] // 3.5" x 8.5" in mm
  });

  // Add background image if provided
  if (backgroundImage) {
    try {
      doc.addImage(backgroundImage, 'PNG', 0, 0, 215.9, 88.9);
    } catch (error) {
      console.error('Failed to add background image:', error);
    }
  }

  // Set font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // Format date as DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Add cheque details using layout coordinates
  // Payee Name
  doc.text(cheque.payeeName, pxToMm(layout.payeeX), pxToMm(layout.payeeY));

  // Amount in Words
  doc.text(cheque.amountWords, pxToMm(layout.amountWordsX), pxToMm(layout.amountWordsY));

  // Amount in Numbers
  doc.text(`₹ ${cheque.amount.toFixed(2)}`, pxToMm(layout.amountX), pxToMm(layout.amountY));

  // Date
  doc.text(formatDate(cheque.date), pxToMm(layout.dateX), pxToMm(layout.dateY));

  return doc;
}

export async function downloadChequePDF(
  cheque: ChequeRecord,
  layout: ChequeLayout,
  backgroundImage?: string
): Promise<void> {
  const doc = await generateChequePDF(cheque, layout, backgroundImage);
  const filename = `cheque_${cheque.payeeName.replace(/\s/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(filename);
}

export async function printCheque(
  cheque: ChequeRecord,
  layout: ChequeLayout,
  backgroundImage?: string
): Promise<void> {
  const doc = await generateChequePDF(cheque, layout, backgroundImage);
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
}
