import { ChequeLayout } from '@/lib/storage';

interface ChequePreviewProps {
  payeeName: string;
  amount: string;
  amountWords: string;
  date: string;
  layout: ChequeLayout;
}

export const ChequePreview = ({ payeeName, amount, amountWords, date, layout }: ChequePreviewProps) => {
  // Format date as spaced digits
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}${month}${year}`.split('').join(' ');
  };

  return (
    <div className="relative w-full border rounded-lg overflow-hidden bg-white shadow-lg">
      {layout.backgroundImage && (
        <img 
          src={layout.backgroundImage} 
          alt="Cheque background" 
          className="w-full h-auto"
        />
      )}
      
      {/* If no background, show a placeholder */}
      {!layout.backgroundImage && (
        <div className="w-full aspect-[2.5/1] bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-dashed border-gray-300" />
      )}

      {/* Overlay text fields */}
      <div className="absolute inset-0">
        {payeeName && (
          <div
            className="absolute text-black font-medium whitespace-nowrap"
            style={{ 
              left: `${layout.payeeX}px`, 
              top: `${layout.payeeY}px`,
              fontSize: '14px'
            }}
          >
            **{payeeName}**
          </div>
        )}

        {amountWords && (
          <div
            className="absolute text-black font-medium whitespace-nowrap"
            style={{ 
              left: `${layout.amountWordsX}px`, 
              top: `${layout.amountWordsY}px`,
              fontSize: '14px'
            }}
          >
            **{amountWords}**
          </div>
        )}

        {amount && (
          <div
            className="absolute text-black font-medium whitespace-nowrap"
            style={{ 
              left: `${layout.amountX}px`, 
              top: `${layout.amountY}px`,
              fontSize: '14px'
            }}
          >
            ₹ {parseFloat(amount).toFixed(2)}
          </div>
        )}

        {date && (
          <div
            className="absolute text-black font-medium whitespace-nowrap tracking-wider"
            style={{ 
              left: `${layout.dateX}px`, 
              top: `${layout.dateY}px`,
              fontSize: '14px'
            }}
          >
            {formatDate(date)}
          </div>
        )}

        <div
          className="absolute text-black font-bold text-xs whitespace-nowrap"
          style={{ 
            left: `${layout.acPayeeX}px`, 
            top: `${layout.acPayeeY}px`
          }}
        >
          A/C PAYEE ONLY
        </div>
      </div>
    </div>
  );
};
