import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface AppCardProps {
  id: string;
  name: string;
  description: string | null;
  version: string | null;
  logo_url: string | null;
  winget_command: string;
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
  isSelected: boolean;
}

export function AppCard({
  id,
  name,
  description,
  version,
  logo_url,
  winget_command,
  onSelect,
  onDeselect,
  isSelected,
}: AppCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        className="app-card cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <img src={logo_url || '/placeholder.svg'} alt={`${name} logo`} className="app-logo" />
        <h3 className="font-semibold text-sm mb-1">{name}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
        <div className="flex gap-2 mt-auto">
          <Button
            variant={isSelected ? "destructive" : "default"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              isSelected ? onDeselect(id) : onSelect(id);
            }}
          >
            {isSelected ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Versiyon</h4>
              <p className="text-sm text-muted-foreground">{version}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Winget Komutu</h4>
              <code className="bg-[hsl(var(--code-bg))] p-2 rounded block text-sm w-full">
                {winget_command}
              </code>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}