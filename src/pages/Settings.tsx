import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Download, Upload, Database, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getCheques, getLayouts } from '@/lib/storage';

const Settings = () => {
  const handleExportData = async () => {
    try {
      const cheques = await getCheques();
      const layouts = await getLayouts();
      
      const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        cheques,
        layouts,
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chequeprinter-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Here you would implement the import logic
        toast.info('Import functionality will restore your data');
      } catch (error) {
        console.error('Import failed:', error);
        toast.error('Failed to import data');
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4 md:pt-20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences</p>
        </div>

        <div className="space-y-6">
          {/* Backup & Restore */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Backup & Restore
              </CardTitle>
              <CardDescription>
                Export or import your cheque data and layouts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={handleExportData} className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button onClick={handleImportData} variant="outline" className="flex-1 gap-2">
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted and stored locally on this device. Regular backups are recommended.
              </p>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary" />
                Security
              </CardTitle>
              <CardDescription>
                Security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">App Lock</p>
                    <p className="text-sm text-muted-foreground">Require PIN or biometric to open app</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Auto-lock Timer</p>
                    <p className="text-sm text-muted-foreground">Lock app after 60 seconds of inactivity</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Adjust
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">Encrypted Local Storage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span className="font-medium">Progressive Web App</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
