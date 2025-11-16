import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigation } from '@/components/Navigation';
import { saveLayout, getLayouts, ChequeLayout } from '@/lib/storage';
import { toast } from 'sonner';
import { Save, Upload, Download } from 'lucide-react';

const LayoutEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [layoutName, setLayoutName] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({
    payeeX: 125,
    payeeY: 165,
    amountX: 950,
    amountY: 215,
    amountWordsX: 125,
    amountWordsY: 215,
    dateX: 940,
    dateY: 65,
  });

  useEffect(() => {
    if (id) {
      loadLayout(id);
    }
  }, [id]);

  const loadLayout = async (layoutId: string) => {
    const layouts = await getLayouts();
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setLayoutName(layout.name);
      setCoordinates({
        payeeX: layout.payeeX,
        payeeY: layout.payeeY,
        amountX: layout.amountX,
        amountY: layout.amountY,
        amountWordsX: layout.amountWordsX,
        amountWordsY: layout.amountWordsY,
        dateX: layout.dateX,
        dateY: layout.dateY,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!layoutName.trim()) {
      toast.error('Please enter a layout name');
      return;
    }

    try {
      const layout: ChequeLayout = {
        id: id || crypto.randomUUID(),
        name: layoutName,
        ...coordinates,
      };

      await saveLayout(layout);
      toast.success('Layout saved successfully!');
      navigate('/layouts');
    } catch (error) {
      console.error('Failed to save layout:', error);
      toast.error('Failed to save layout');
    }
  };

  const handleExport = () => {
    const data = {
      name: layoutName,
      coordinates,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${layoutName.replace(/\s/g, '_')}_layout.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Layout exported!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          setLayoutName(data.name || '');
          setCoordinates(data.coordinates || coordinates);
          toast.success('Layout imported!');
        } catch (error) {
          toast.error('Invalid layout file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4 md:pt-20">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {id ? 'Edit Layout' : 'New Layout'}
            </CardTitle>
            <CardDescription>
              Configure cheque layout coordinates for precise positioning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="layoutName">Layout Name *</Label>
              <Input
                id="layoutName"
                placeholder="e.g., HDFC Bank"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Background Image (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {backgroundImage && (
                  <Button
                    variant="outline"
                    onClick={() => setBackgroundImage(null)}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {backgroundImage && (
              <div className="border rounded-lg p-4 bg-muted">
                <img
                  src={backgroundImage}
                  alt="Cheque background"
                  className="max-w-full h-auto"
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Payee Name Position</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payeeX">X (pixels)</Label>
                    <Input
                      id="payeeX"
                      type="number"
                      value={coordinates.payeeX}
                      onChange={(e) => setCoordinates({ ...coordinates, payeeX: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payeeY">Y (pixels)</Label>
                    <Input
                      id="payeeY"
                      type="number"
                      value={coordinates.payeeY}
                      onChange={(e) => setCoordinates({ ...coordinates, payeeY: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Amount in Numbers Position</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amountX">X (pixels)</Label>
                    <Input
                      id="amountX"
                      type="number"
                      value={coordinates.amountX}
                      onChange={(e) => setCoordinates({ ...coordinates, amountX: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amountY">Y (pixels)</Label>
                    <Input
                      id="amountY"
                      type="number"
                      value={coordinates.amountY}
                      onChange={(e) => setCoordinates({ ...coordinates, amountY: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Amount in Words Position</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amountWordsX">X (pixels)</Label>
                    <Input
                      id="amountWordsX"
                      type="number"
                      value={coordinates.amountWordsX}
                      onChange={(e) => setCoordinates({ ...coordinates, amountWordsX: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amountWordsY">Y (pixels)</Label>
                    <Input
                      id="amountWordsY"
                      type="number"
                      value={coordinates.amountWordsY}
                      onChange={(e) => setCoordinates({ ...coordinates, amountWordsY: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Date Position</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateX">X (pixels)</Label>
                    <Input
                      id="dateX"
                      type="number"
                      value={coordinates.dateX}
                      onChange={(e) => setCoordinates({ ...coordinates, dateX: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateY">Y (pixels)</Label>
                    <Input
                      id="dateY"
                      type="number"
                      value={coordinates.dateY}
                      onChange={(e) => setCoordinates({ ...coordinates, dateY: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 flex-wrap">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Layout
              </Button>
              
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export JSON
              </Button>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-layout"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('import-layout')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import JSON
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate('/layouts')}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LayoutEditor;
