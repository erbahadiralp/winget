import { useState } from "react";
import { AppCard } from "./AppCard";
import { Button } from "@/components/ui/button";
import { Download, Moon, Sun, Package, Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function fetchApps() {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching apps:', error);
    throw error;
  }
  return data;
}

export function AppGrid() {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
  });

  if (error) {
    console.error('Error in useQuery:', error);
  }

  const handleSelect = (id: string) => {
    if (selectedApps.length >= 5) {
      toast({
        title: "Maksimum seçim sınırına ulaştınız",
        description: "Daha fazla uygulama seçmek için giriş yapmalısınız.",
        variant: "destructive",
      });
      return;
    }
    setSelectedApps([...selectedApps, id]);
  };

  const handleDeselect = (id: string) => {
    setSelectedApps(selectedApps.filter((appId) => appId !== id));
  };

  const generateBatchFile = (command: string) => {
    const batchContent = `@echo off\n${command}`;
    
    const blob = new Blob([batchContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "winget-install.bat";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Başarılı",
      description: "Kurulum dosyası indirildi.",
    });
  };

  const generateSelectedAppsBatch = () => {
    if (selectedApps.length === 0) {
      toast({
        title: "Hata",
        description: "Lütfen en az bir uygulama seçin.",
        variant: "destructive",
      });
      return;
    }

    const commands = selectedApps
      .map((id) => {
        const app = apps.find((app) => app.id === id);
        return app?.winget_command;
      })
      .filter(Boolean)
      .join("\n");

    generateBatchFile(commands);
  };

  const generateUpdateAllBatch = () => {
    generateBatchFile("winget upgrade --all");
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-teal to-primary-indigo bg-clip-text text-transparent">
            winget
          </h1>
          <div className="flex items-center gap-4">
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Winget deposunu inceleyin.</h2>
          <p className="text-lg text-muted-foreground mb-6">
              Windows Paket Yöneticisi ile Windows uygulamalarını hızlıca yükleyin.
          </p>
          

          {/* Update All Apps Button */}
          <Button
            onClick={generateUpdateAllBatch}
            className="mb-8 bg-primary-teal hover:bg-primary-teal/90"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tüm uygulamaları güncelle
          </Button>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              placeholder="Uygulama ara"
              className="pl-10 bg-secondary-slate/5 dark:bg-secondary-slate/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Popular Apps Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Tüm Uygulamalar</h3>
              
            </div>
            
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading apps...</div>
          ) : (
            <div className="app-grid">
              {filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  {...app}
                  onSelect={handleSelect}
                  onDeselect={handleDeselect}
                  isSelected={selectedApps.includes(app.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Selected {selectedApps.length} apps so far
              </span>
              {selectedApps.length < 5 && (
                <span className="text-sm text-muted-foreground">
                  Need {5 - selectedApps.length} more apps to create a pack
                </span>
              )}
            </div>
            <Button
              onClick={generateSelectedAppsBatch}
              disabled={selectedApps.length === 0}
              className="bg-primary-teal hover:bg-primary-teal/90"
            >
              <Download className="mr-2 h-4 w-4" />
              Script oluştur
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}