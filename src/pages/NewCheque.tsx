import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/Navigation';
import { ChequePreview } from '@/components/ChequePreview';
import { saveCheque, getLayouts, ChequeLayout, initializeDefaultLayouts } from '@/lib/storage';
import { amountToWords } from '@/lib/amountToWords';
import { downloadChequePDF, printCheque } from '@/lib/pdfGenerator';
import { toast } from 'sonner';
import { Printer, Download, Eye } from 'lucide-react';

const NewCheque = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState<ChequeLayout[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    payeeName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    layoutId: '',
  });
  const [amountInWords, setAmountInWords] = useState('');

  useEffect(() => {
    loadLayouts();
  }, []);

  useEffect(() => {
    if (formData.amount) {
      const num = parseFloat(formData.amount);
      if (!isNaN(num)) {
        setAmountInWords(amountToWords(num));
      }
    } else {
      setAmountInWords('');
    }
  }, [formData.amount]);

  const loadLayouts = async () => {
    await initializeDefaultLayouts();
    const data = await getLayouts();
    setLayouts(data);
    if (data.length > 0 && !formData.layoutId) {
      setFormData(prev => ({ ...prev, layoutId: data[0].id }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.payeeName || !formData.amount || !formData.layoutId) {
      toast.error('Please fill all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const selectedLayout = layouts.find(l => l.id === formData.layoutId);
      
      await saveCheque({
        id: crypto.randomUUID(),
        payeeName: formData.payeeName,
        amount,
        amountWords: amountInWords,
        date: formData.date,
        bank: selectedLayout?.name || '',
        layoutId: formData.layoutId,
        createdAt: new Date().toISOString(),
      });

      toast.success('Cheque saved successfully!');
      navigate('/history');
    } catch (error) {
      console.error('Failed to save cheque:', error);
      toast.error('Failed to save cheque');
    }
  };

  const handleDownload = async () => {
    if (!formData.payeeName || !formData.amount || !formData.layoutId) {
      toast.error('Please fill all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const selectedLayout = layouts.find(l => l.id === formData.layoutId);
      if (!selectedLayout) {
        toast.error('Layout not found');
        return;
      }

      const cheque = {
        id: crypto.randomUUID(),
        payeeName: formData.payeeName,
        amount,
        amountWords: amountInWords,
        date: formData.date,
        bank: selectedLayout.name,
        layoutId: formData.layoutId,
        createdAt: new Date().toISOString(),
      };

      await downloadChequePDF(cheque, selectedLayout, selectedLayout.backgroundImage);
      toast.success('Cheque downloaded!');
    } catch (error) {
      console.error('Failed to download:', error);
      toast.error('Failed to download cheque');
    }
  };

  const handlePrint = async () => {
    if (!formData.payeeName || !formData.amount || !formData.layoutId) {
      toast.error('Please fill all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const selectedLayout = layouts.find(l => l.id === formData.layoutId);
      if (!selectedLayout) {
        toast.error('Layout not found');
        return;
      }

      const cheque = {
        id: crypto.randomUUID(),
        payeeName: formData.payeeName,
        amount,
        amountWords: amountInWords,
        date: formData.date,
        bank: selectedLayout.name,
        layoutId: formData.layoutId,
        createdAt: new Date().toISOString(),
      };

      await printCheque(cheque, selectedLayout, selectedLayout.backgroundImage);
    } catch (error) {
      console.error('Failed to print:', error);
      toast.error('Failed to print cheque');
    }
  };

  const selectedLayout = layouts.find(l => l.id === formData.layoutId);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4 md:pt-20">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Printer className="w-6 h-6 text-primary" />
              New Cheque
            </CardTitle>
            <CardDescription>Fill in the cheque details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="payeeName">Payee Name *</Label>
                <Input
                  id="payeeName"
                  placeholder="Enter payee name"
                  value={formData.payeeName}
                  onChange={(e) => setFormData({ ...formData, payeeName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                {amountInWords && (
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {amountInWords}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank">Bank / Layout *</Label>
                <Select
                  value={formData.layoutId}
                  onValueChange={(value) => setFormData({ ...formData, layoutId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank layout" />
                  </SelectTrigger>
                  <SelectContent>
                    {layouts.map(layout => (
                      <SelectItem key={layout.id} value={layout.id}>
                        {layout.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showPreview && selectedLayout && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <ChequePreview
                    payeeName={formData.payeeName}
                    amount={formData.amount}
                    amountWords={amountInWords}
                    date={formData.date}
                    layout={selectedLayout}
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>

                <Button type="submit" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Save Cheque
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>

                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewCheque;
