import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, X, Camera, AlertCircle, ShieldAlert } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

interface QrScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (decodedText: string) => void;
}

export function QrScannerModal({ open, onOpenChange, onScan }: QrScannerModalProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSecureContext, setIsSecureContext] = useState(true);

  useEffect(() => {
    // Verificar si el contexto es seguro (localhost o HTTPS)
    if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
      setIsSecureContext(false);
    }
  }, []);

  useEffect(() => {
    let timeoutId: number;

    if (open) {
      // Esperar un momento a que el modal se renderice completamente
      timeoutId = window.setTimeout(() => {
        initScanner();
      }, 300);
    } else {
      stopScanning();
    }

    return () => {
      window.clearTimeout(timeoutId);
      stopScanning();
    };
  }, [open]);

  const initScanner = async () => {
    try {
      const element = document.getElementById("qr-reader");
      if (!element) {
        console.warn("Elemento 'qr-reader' no encontrado en el DOM todavía");
        return;
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }
      
      await startScanning();
    } catch (err: any) {
      console.error('Error al inicializar Html5Qrcode:', err);
      setError("Error de inicialización: " + err.message);
    }
  };

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      setError(null);
      setIsScanning(true);

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          console.log("QR Detectado:", decodedText);
          toast.success('Código QR detectado');
          handleClose();
          onScan(decodedText);
        },
        () => {
          // Escaneo silencioso
        }
      );
    } catch (err: any) {
      console.error('Error al iniciar cámara:', err);
      let errorMsg = 'No se pudo acceder a la cámara.';
      
      if (err.name === 'NotAllowedError') errorMsg = 'Permiso de cámara denegado.';
      if (err.name === 'NotFoundError') errorMsg = 'No se encontró ninguna cámara.';
      
      setError(errorMsg);
      setIsScanning(false);
      toast.error(errorMsg);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error al detener cámara:', err);
      }
    }
  };

  const handleClose = async () => {
    await stopScanning();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-primary">
            <QrCode className="h-5 w-5" />
            Escanear Código QR
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 flex flex-col items-center min-h-[350px] justify-center">
          {!isSecureContext ? (
            <div className="w-full p-4 bg-warning/10 border border-warning/20 rounded-lg flex flex-col items-center text-center gap-3">
              <ShieldAlert className="h-10 w-10 text-warning" />
              <div className="space-y-1">
                <p className="font-bold text-warning">Contexto No Seguro</p>
                <p className="text-xs text-muted-foreground">
                  Los navegadores solo permiten la cámara en <b>localhost</b> o sitios con <b>HTTPS</b>.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex flex-col items-center text-center gap-3">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <div className="space-y-1">
                <p className="font-bold text-destructive">Error de Cámara</p>
                <p className="text-xs text-destructive/80">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={startScanning}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Intentar de nuevo
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div 
                id="qr-reader" 
                className="w-full max-w-[300px] aspect-square overflow-hidden rounded-xl border-2 border-primary/20 bg-black shadow-inner"
              ></div>
              <div className="mt-6 space-y-2 text-center">
                <p className="text-sm font-medium animate-pulse text-primary">
                  {isScanning ? 'Escaneando...' : 'Iniciando cámara...'}
                </p>
                <p className="text-xs text-muted-foreground max-w-[250px]">
                  Apunta al código QR del uniforme o gafete.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t flex justify-end bg-muted/30">
          <Button variant="ghost" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
