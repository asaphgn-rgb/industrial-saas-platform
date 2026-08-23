import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  loading?: boolean;
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function FileUploadDropzone({
  onFileSelect,
  accept = ".xlsx,.xls,.csv,.pdf",
  loading = false,
  title = "Arrastar e soltar arquivo",
  description = "ou clique para selecionar (Excel, CSV ou PDF)",
  className,
  compact = false,
}: FileUploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
        loading && "pointer-events-none opacity-60",
        compact ? "p-4" : "p-10",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      <div className={cn("flex flex-col items-center text-center", compact ? "gap-1" : "gap-2")}>
        {loading ? (
          <Loader2 className={cn("animate-spin text-primary", compact ? "h-6 w-6" : "h-10 w-10")} />
        ) : (
          <div className="relative">
            <Upload className={cn("text-muted-foreground", compact ? "h-6 w-6" : "h-10 w-10")} />
            <div className="absolute -right-2 -top-2 flex gap-1">
              <FileSpreadsheet className="h-4 w-4 text-success opacity-80" />
            </div>
          </div>
        )}
        
        <div className="mt-2">
          <p className={cn("font-medium", compact ? "text-sm" : "text-base")}>{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {isDragActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
          Solte para enviar
        </div>
      )}
    </div>
  );
}
