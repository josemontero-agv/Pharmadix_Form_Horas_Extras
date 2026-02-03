import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConnectionStatus, HojaTiempo } from '@/types/pharmadix';
import { FilePlus, ClipboardList, RefreshCw, Clock, User, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online');
  const [pendingSheets, setPendingSheets] = useState(0);

  // Simular detección de conexión
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simular hojas pendientes
    const storedSheets = localStorage.getItem('pharmadix_hojas');
    if (storedSheets) {
      const hojas: HojaTiempo[] = JSON.parse(storedSheets);
      const pending = hojas.filter((h) => !h.sincronizada).length;
      setPendingSheets(pending);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    setConnectionStatus('syncing');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setConnectionStatus('online');
    setPendingSheets(0);
    toast.success('Sincronización completada');
  };

  const handleLogout = () => {
    toast.success('Sesión cerrada');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        title="Pharmadix Times"
        connectionStatus={connectionStatus}
      />

      <PageContainer className="flex flex-col gap-4">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm">Bienvenido</p>
                <h2 className="text-xl font-bold">Tomador de Tiempos</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-primary-foreground/80 text-sm">
              <Clock className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Actions */}
        <div className="space-y-3">
          <Button
            size="action"
            className="w-full justify-start gap-4 shadow-md"
            onClick={() => navigate('/nueva-hoja')}
          >
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <FilePlus className="h-6 w-6" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold">Nueva Hoja</span>
              <span className="text-primary-foreground/70 text-sm font-normal">
                Registrar operarios
              </span>
            </div>
          </Button>

          <Button
            variant="secondary"
            size="action"
            className="w-full justify-start gap-4 shadow-md"
            onClick={() => navigate('/mis-hojas')}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary-foreground/10 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div className="text-left flex-1">
              <span className="block text-lg font-bold text-secondary-foreground">Mis Hojas</span>
              <span className="text-secondary-foreground/70 text-sm font-normal">
                Ver hojas creadas
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            size="action"
            className="w-full justify-start gap-4"
            onClick={handleSync}
            disabled={connectionStatus === 'syncing'}
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <RefreshCw className={`h-6 w-6 text-muted-foreground ${connectionStatus === 'syncing' ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-left flex-1">
              <span className="block text-lg font-bold">Sincronizar</span>
              <span className="text-muted-foreground text-sm font-normal">
                {pendingSheets > 0 ? `${pendingSheets} hojas pendientes` : 'Todo sincronizado'}
              </span>
            </div>
            {pendingSheets > 0 && (
              <Badge variant="warning" className="ml-auto">
                {pendingSheets}
              </Badge>
            )}
          </Button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </PageContainer>
    </div>
  );
}
