import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Layout, TrendingUp } from 'lucide-react';
import { getCheques, ChequeRecord } from '@/lib/storage';
import { Navigation } from '@/components/Navigation';

const Home = () => {
  const [cheques, setCheques] = useState<ChequeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheques();
  }, []);

  const loadCheques = async () => {
    try {
      const data = await getCheques();
      setCheques(data);
    } catch (error) {
      console.error('Failed to load cheques:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cheques.reduce((sum, cheque) => sum + cheque.amount, 0);
  const thisMonthCheques = cheques.filter(c => {
    const chequeDate = new Date(c.createdAt);
    const now = new Date();
    return chequeDate.getMonth() === now.getMonth() && 
           chequeDate.getFullYear() === now.getFullYear();
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4 md:pt-20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            ChequePrinter
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Professional cheque printing & management system
          </p>
          <Link to="/new-cheque">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5 mr-2" />
              Create New Cheque
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cheques
              </CardTitle>
              <FileText className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? '...' : cheques.length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loading ? '...' : thisMonthCheques.length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
              <Layout className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ₹{loading ? '...' : totalAmount.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/history'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Cheques
              </CardTitle>
              <CardDescription>View and manage your cheque history</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : cheques.length === 0 ? (
                <p className="text-muted-foreground">No cheques created yet</p>
              ) : (
                <div className="space-y-2">
                  {cheques.slice(0, 3).map(cheque => (
                    <div key={cheque.id} className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="font-medium">{cheque.payeeName}</span>
                      <span className="text-sm text-muted-foreground">
                        ₹{cheque.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/layouts'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-secondary" />
                Cheque Layouts
              </CardTitle>
              <CardDescription>Manage and customize bank layouts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Customize cheque positioning for different banks
              </p>
              <Button variant="outline" className="w-full">
                Manage Layouts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
