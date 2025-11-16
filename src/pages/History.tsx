import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Navigation } from '@/components/Navigation';
import { getCheques, deleteCheque, ChequeRecord, getLayouts } from '@/lib/storage';
import { downloadChequePDF, printCheque } from '@/lib/pdfGenerator';
import { toast } from 'sonner';
import { Search, Trash2, Calendar, Building2, IndianRupee, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';

const History = () => {
  const [cheques, setCheques] = useState<ChequeRecord[]>([]);
  const [filteredCheques, setFilteredCheques] = useState<ChequeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheques();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = cheques.filter(cheque =>
        cheque.payeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cheque.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cheque.amount.toString().includes(searchQuery)
      );
      setFilteredCheques(filtered);
    } else {
      setFilteredCheques(cheques);
    }
  }, [searchQuery, cheques]);

  const loadCheques = async () => {
    try {
      const data = await getCheques();
      setCheques(data);
      setFilteredCheques(data);
    } catch (error) {
      console.error('Failed to load cheques:', error);
      toast.error('Failed to load cheques');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cheque?')) return;
    
    try {
      await deleteCheque(id);
      toast.success('Cheque deleted successfully');
      loadCheques();
    } catch (error) {
      console.error('Failed to delete cheque:', error);
      toast.error('Failed to delete cheque');
    }
  };

  const handleDownload = async (cheque: ChequeRecord) => {
    try {
      const layouts = await getLayouts();
      const layout = layouts.find(l => l.id === cheque.layoutId);
      if (!layout) {
        toast.error('Layout not found');
        return;
      }
      await downloadChequePDF(cheque, layout, layout.backgroundImage);
      toast.success('Cheque downloaded!');
    } catch (error) {
      console.error('Failed to download cheque:', error);
      toast.error('Failed to download cheque');
    }
  };

  const handlePrint = async (cheque: ChequeRecord) => {
    try {
      const layouts = await getLayouts();
      const layout = layouts.find(l => l.id === cheque.layoutId);
      if (!layout) {
        toast.error('Layout not found');
        return;
      }
      await printCheque(cheque, layout, layout.backgroundImage);
    } catch (error) {
      console.error('Failed to print cheque:', error);
      toast.error('Failed to print cheque');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4 md:pt-20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Cheque History</h1>
          <p className="text-muted-foreground">View and manage all your cheques</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by payee, bank, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading cheques...
          </div>
        ) : filteredCheques.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? 'No cheques found matching your search' : 'No cheques created yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCheques.map((cheque) => (
              <Card key={cheque.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{cheque.payeeName}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {cheque.bank}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(cheque.date), 'dd MMM yyyy')}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cheque.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                          <IndianRupee className="w-6 h-6" />
                          {cheque.amount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {cheque.amountWords}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created {format(new Date(cheque.createdAt), 'dd MMM yyyy, HH:mm')}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(cheque)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrint(cheque)}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cheque.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
