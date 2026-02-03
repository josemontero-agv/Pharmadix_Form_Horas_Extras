import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConnectionStatus, HojaTiempo } from '@/types/pharmadix';
import { FileText, Calendar, Users, Clock, ChevronRight, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MisHojas() {
  const navigate = useNavigate();
  const [connectionStatus] = useState<ConnectionStatus>('online');
  const [hojas, setHojas] = useState<HojaTiempo[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('pharmadix_hojas');
    if (stored) {
      setHojas(JSON.parse(stored));
    }
  }, []);

  const getStatusBadge = (estado: string, sincronizada: boolean) => {
    if (!sincronizada) {
      return <Badge variant="pending">Pendiente Sync</Badge>;
    }
    switch (estado) {
      case 'BORRADOR':
        return <Badge variant="outline">Borrador</Badge>;
      case 'CERRADA':
        return <Badge variant="inProgress">Cerrada</Badge>;
      case 'APROBADA':
        return <Badge variant="success">Aprobada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleHojaClick = (hoja: HojaTiempo) => {
    if (hoja.estado === 'BORRADOR') {
      navigate(`/registro-operarios?id=${hoja.id}`);
    } else {
      // Por ahora no tenemos vista de detalle para cerradas, pero podrías añadirla
      toast.info(`Hoja ${hoja.id} está cerrada`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        title="Mis Hojas"
        showBack
        onBack={() => navigate('/dashboard')}
        connectionStatus={connectionStatus}
      />

      <PageContainer>
        {hojas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Inbox className="h-20 w-20 mb-4 opacity-30" />
            <h3 className="text-xl font-semibold mb-2">Sin hojas registradas</h3>
            <p className="text-center text-sm mb-6">
              Crea una nueva hoja para comenzar a registrar tiempos
            </p>
            <Button onClick={() => navigate('/nueva-hoja')}>
              Crear Nueva Hoja
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {hojas.map((hoja) => (
              <Card
                key={hoja.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  !hoja.sincronizada && hoja.estado === 'CERRADA' && 'border-warning/50',
                  hoja.estado === 'BORRADOR' && 'border-blue-200 bg-blue-50/30'
                )}
                onClick={() => handleHojaClick(hoja)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          Lote #{hoja.lote?.numero || 'N/A'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {hoja.lote?.producto || 'Producto'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(hoja.estado, hoja.sincronizada)}
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(hoja.fechaEmision)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{hoja.registros.length} operarios</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>
                        {hoja.registros.reduce((sum, r) => sum + (r.horasTotales || 0), 0).toFixed(1)}h
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Turno: {hoja.turno}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
