import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PenTool, Trash2, Check } from 'lucide-react';

interface SignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (signatureData: string) => void;
  summary: {
    totalOperarios: number;
    totalHoras: number;
  };
}

export function SignatureModal({
  open,
  onOpenChange,
  onConfirm,
  summary,
}: SignatureModalProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigCanvas.current?.clear();
  };

  const handleConfirm = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signatureData = sigCanvas.current.toDataURL('image/png');
      onConfirm(signatureData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            Cerrar Hoja - Firma
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Resumen de la Hoja</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Operarios:</span>
              <span className="font-bold">{summary.totalOperarios}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Horas:</span>
              <span className="font-bold">{summary.totalHoras.toFixed(1)}h</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Firma del Tomador de Tiempos
            </label>
            <div className="border-2 border-dashed border-input rounded-lg bg-background overflow-hidden">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  width: 380,
                  height: 150,
                  className: 'signature-canvas w-full',
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dibuje su firma dentro del recuadro
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            <Check className="h-4 w-4 mr-2" />
            Confirmar y Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
