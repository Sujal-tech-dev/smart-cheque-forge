// Convert amount to words in Indian Numbering System
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';
  
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
  }
  
  const hundred = Math.floor(num / 100);
  const rest = num % 100;
  return ones[hundred] + ' Hundred' + (rest > 0 ? ' and ' + convertLessThanThousand(rest) : '');
}

export function amountToWords(amount: number): string {
  if (amount === 0) return 'Zero Rupees Only';
  
  const [rupees, paiseDecimal] = amount.toFixed(2).split('.');
  const rupeesNum = parseInt(rupees);
  const paiseNum = parseInt(paiseDecimal);
  
  let result = '';
  
  // Indian numbering: crore, lakh, thousand, hundred
  const crore = Math.floor(rupeesNum / 10000000);
  const lakh = Math.floor((rupeesNum % 10000000) / 100000);
  const thousand = Math.floor((rupeesNum % 100000) / 1000);
  const hundred = rupeesNum % 1000;
  
  if (crore > 0) {
    result += convertLessThanThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    result += convertLessThanThousand(hundred) + ' ';
  }
  
  result = result.trim() + ' Rupees';
  
  if (paiseNum > 0) {
    result += ' and ' + convertLessThanThousand(paiseNum) + ' Paise';
  }
  
  return result + ' Only';
}
