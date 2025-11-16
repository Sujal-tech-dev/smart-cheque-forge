import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { getLayouts, deleteLayout, ChequeLayout, initializeDefaultLayouts } from '@/lib/storage';
import { toast } from 'sonner';
import { Layout, Trash2, Plus, Edit } from 'lucide-react';

const Layouts = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState<ChequeLayout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      await initializeDefaultLayouts();
      const data = await getLayouts();
      setLayouts(data);
    } catch (error) {
      console.error('Failed to load layouts:', error);
      toast.error('Failed to load layouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this layout?')) return;
    
    try {
      await deleteLayout(id);
      toast.success('Layout deleted successfully');
      loadLayouts();
    } catch (error) {
      console.error('Failed to delete layout:', error);
      toast.error('Failed to delete layout');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4 md:pt-20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cheque Layouts</h1>
            <p className="text-muted-foreground">Manage positioning for different bank cheques</p>
          </div>
          <Button 
            className="gap-2"
            onClick={() => navigate('/layouts/new')}
          >
            <Plus className="w-4 h-4" />
            New Layout
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading layouts...
          </div>
        ) : layouts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No layouts available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <Card key={layout.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Layout className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{layout.name}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => navigate(`/layouts/edit/${layout.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(layout.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Layout ID: {layout.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Payee:</span>
                        <span className="ml-2 font-mono">{layout.payeeX}, {layout.payeeY}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="ml-2 font-mono">{layout.amountX}, {layout.amountY}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Words:</span>
                        <span className="ml-2 font-mono">{layout.amountWordsX}, {layout.amountWordsY}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <span className="ml-2 font-mono">{layout.dateX}, {layout.dateY}</span>
                      </div>
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

export default Layouts;
