import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConnectionStatus, Lote, Turno } from '@/types/pharmadix';
import { lotes, procesos, areas, turnos } from '@/data/mockData';
import { Package, ArrowRight, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NuevaHoja() {
  const navigate = useNavigate();
  const [connectionStatus] = useState<ConnectionStatus>('online');
  const [searchLote, setSearchLote] = useState('');
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [formData, setFormData] = useState({
    proceso: '',
    area: '',
    cantidadOrdenada: '',
    turno: '' as Turno | '',
  });

  const filteredLotes = lotes.filter(
    (l) =>
      l.numero.includes(searchLote) ||
      l.producto.toLowerCase().includes(searchLote.toLowerCase())
  );

  const handleLoteSelect = (lote: Lote) => {
    setSelectedLote(lote);
    setSearchLote(lote.numero);
    
    if (lote.estado === 'CERRADO') {
      toast.error('Este lote ya está cerrado y no permite nuevos registros');
    }

    setFormData({
      proceso: lote.proceso,
      area: lote.area,
      cantidadOrdenada: lote.cantidadOrdenada.toString(),
      turno: '',
    });
    setShowSuggestions(false);
  };

  const handleContinue = () => {
    if (!selectedLote) {
      toast.error('Seleccione un lote');
      return;
    }
    
    if (selectedLote.estado === 'CERRADO') {
      toast.error('No se puede registrar en un lote cerrado');
      return;
    }

    if (!formData.turno) {
      toast.error('Seleccione un turno');
      return;
    }

    // Guardar datos de la hoja temporal
    const hojaTemp = {
      lote: selectedLote,
      ...formData,
      fechaInicio: new Date().toISOString(),
    };
    localStorage.setItem('pharmadix_hoja_temp', JSON.stringify(hojaTemp));
    
    navigate('/registro-operarios');
  };

  const isLoteCerrado = selectedLote?.estado === 'CERRADO';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        title="Nueva Hoja"
        showBack
        onBack={() => navigate('/dashboard')}
        connectionStatus={connectionStatus}
      />

      <PageContainer>
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Datos del Lote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lote Search */}
            <div className="space-y-2 relative">
              <Label htmlFor="lote">Número de Lote</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lote"
                  placeholder="Buscar o escribir..."
                  className={`pl-10 ${isLoteCerrado ? 'border-destructive' : ''}`}
                  value={searchLote}
                  onChange={(e) => {
                    setSearchLote(e.target.value);
                    setShowSuggestions(true);
                    if (!e.target.value) setSelectedLote(null);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
              
              {/* Lote Status Indicator */}
              {selectedLote && (
                <div className={`flex items-center gap-2 text-xs font-medium mt-1 ${isLoteCerrado ? 'text-destructive' : 'text-success'}`}>
                  {isLoteCerrado ? (
                    <><AlertCircle className="h-3 w-3" /> LOTE CERRADO - No permite registros</>
                  ) : (
                    <><CheckCircle2 className="h-3 w-3" /> LOTE ACTIVO - Disponible</>
                  )}
                </div>
              )}
              
              {/* Suggestions Dropdown */}
              {showSuggestions && searchLote && filteredLotes.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredLotes.map((lote) => (
                    <button
                      key={lote.id}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-border/50 last:border-0"
                      onClick={() => handleLoteSelect(lote)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Lote #{lote.numero}</p>
                          <p className="text-sm text-muted-foreground">{lote.producto}</p>
                        </div>
                        <Badge variant={lote.estado === 'ABIERTO' ? 'open' : 'closed'} className="text-[10px] h-5">
                          {lote.estado}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product (auto-filled) */}
            <div className="space-y-2">
              <Label htmlFor="producto">Producto</Label>
              <Input
                id="producto"
                value={selectedLote?.producto || ''}
                readOnly
                className="bg-muted text-muted-foreground"
                placeholder="Se llenará automáticamente"
              />
            </div>

            {/* Presentation (auto-filled) */}
            <div className="space-y-2">
              <Label htmlFor="presentacion">Presentación</Label>
              <Input
                id="presentacion"
                value={selectedLote?.presentacion || ''}
                readOnly
                className="bg-muted text-muted-foreground"
                placeholder="Se llenará automáticamente"
              />
            </div>

            {/* Process & Area Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Proceso</Label>
                <Select
                  value={formData.proceso}
                  onValueChange={(v) => setFormData({ ...formData, proceso: v })}
                  disabled={isLoteCerrado}
                >
                  <SelectTrigger className={isLoteCerrado ? 'opacity-50' : ''}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {procesos.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Área</Label>
                <Select
                  value={formData.area}
                  onValueChange={(v) => setFormData({ ...formData, area: v })}
                  disabled={isLoteCerrado}
                >
                  <SelectTrigger className={isLoteCerrado ? 'opacity-50' : ''}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad Ordenada</Label>
              <Input
                id="cantidad"
                type="number"
                placeholder="50,000"
                value={formData.cantidadOrdenada}
                onChange={(e) =>
                  setFormData({ ...formData, cantidadOrdenada: e.target.value })
                }
                disabled={isLoteCerrado}
                className={isLoteCerrado ? 'bg-muted' : ''}
              />
            </div>

            {/* Turno */}
            <div className="space-y-2">
              <Label>Turno</Label>
              <Select
                value={formData.turno}
                onValueChange={(v) => setFormData({ ...formData, turno: v as Turno })}
                disabled={isLoteCerrado}
              >
                <SelectTrigger className={isLoteCerrado ? 'opacity-50' : ''}>
                  <SelectValue placeholder="Seleccionar turno" />
                </SelectTrigger>
                <SelectContent>
                  {turnos.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleContinue}
                disabled={!selectedLote || !formData.turno || isLoteCerrado}
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}
