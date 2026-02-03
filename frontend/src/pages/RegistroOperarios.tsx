import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OperatorCard } from '@/components/operators/OperatorCard';
import { OperatorSearch } from '@/components/operators/OperatorSearch';
import { OperatorModal } from '@/components/operators/OperatorModal';
import { QrScannerModal } from '@/components/operators/QrScannerModal';
import { SignatureModal } from '@/components/signature/SignatureModal';
import { ConnectionStatus, Empleado, RegistroTiempo, Lote, HojaTiempo } from '@/types/pharmadix';
import { empleados, actividades } from '@/data/mockData';
import { QrCode, Search, Clock, Users, FileCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface HojaTemp {
  lote: Lote;
  proceso: string;
  area: string;
  cantidadOrdenada: string;
  turno: string;
  fechaInicio: string;
}

export default function RegistroOperarios() {
  const navigate = useNavigate();
  const [connectionStatus] = useState<ConnectionStatus>('online');
  const [hojaTemp, setHojaTemp] = useState<HojaTemp | null>(null);
  const [registros, setRegistros] = useState<RegistroTiempo[]>([]);
  
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [operatorModalOpen, setOperatorModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroTiempo | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('pharmadix_hoja_temp');
    if (stored) {
      setHojaTemp(JSON.parse(stored));
    } else {
      navigate('/nueva-hoja');
    }
  }, [navigate]);

  const registeredIds = registros.map((r) => r.empleadoId);

  const handleOperatorSelect = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    const existingRegistro = registros.find((r) => r.empleadoId === empleado.id);
    setSelectedRegistro(existingRegistro || null);
    setOperatorModalOpen(true);
  };

  const handleQrScan = (decodedText: string) => {
    // Buscar empleado por ID o Gafete (dependiendo de qué contenga el QR)
    // Según los ejemplos del usuario, el QR tiene formato "EMP-001" o "EMP-jperez"
    const empleado = empleados.find((e) => e.id === decodedText || e.gafete === decodedText);
    
    if (empleado) {
      handleOperatorSelect(empleado);
      toast.success(`Operario identificado: ${empleado.nombre}`);
    } else {
      toast.error('Código QR no reconocido como operario válido');
    }
  };

  const handleRegistrarEntrada = (empleadoId: string, actividad: string) => {
    const now = new Date();
    const horaEntrada = now.toTimeString().substring(0, 8);
    
    const nuevoRegistro: RegistroTiempo = {
      id: `REG-${Date.now()}`,
      empleadoId,
      actividad,
      horaEntrada,
      horaSalida: null,
      horasTotales: null,
      estado: 'EN_PROCESO',
    };

    setRegistros([...registros, nuevoRegistro]);
    toast.success('Entrada registrada correctamente');
  };

  const handleRegistrarSalida = (registroId: string) => {
    const now = new Date();
    const horaSalida = now.toTimeString().substring(0, 8);
    
    setRegistros(
      registros.map((r) => {
        if (r.id === registroId) {
          const [hE, mE] = r.horaEntrada!.split(':').map(Number);
          const [hS, mS] = horaSalida.split(':').map(Number);
          const minutosEntrada = hE * 60 + mE;
          const minutosSalida = hS * 60 + mS;
          const horasTotales = (minutosSalida - minutosEntrada) / 60;

          return {
            ...r,
            horaSalida,
            horasTotales: Math.max(0, horasTotales),
            estado: 'FINALIZADO' as const,
          };
        }
        return r;
      })
    );
    toast.success('Salida registrada correctamente');
  };

  const handleOperatorCardClick = (registro: RegistroTiempo) => {
    const empleado = empleados.find((e) => e.id === registro.empleadoId);
    if (empleado) {
      setSelectedEmpleado(empleado);
      setSelectedRegistro(registro);
      setOperatorModalOpen(true);
    }
  };

  const handleCerrarHoja = () => {
    if (registros.length === 0) {
      toast.error('Debe registrar al menos un operario');
      return;
    }

    const pendientes = registros.filter((r) => r.estado === 'EN_PROCESO');
    if (pendientes.length > 0) {
      toast.error(`Hay ${pendientes.length} operario(s) sin registrar salida`);
      return;
    }

    setSignatureModalOpen(true);
  };

  const handleSignatureConfirm = (signatureData: string) => {
    if (!hojaTemp) return;

    const nuevaHoja: HojaTiempo = {
      id: `HOJA-${Date.now()}`,
      numeroHoja: 1,
      loteId: hojaTemp.lote.id,
      lote: hojaTemp.lote,
      tomadorId: 'USER-001',
      fechaEmision: new Date().toISOString().split('T')[0],
      turno: hojaTemp.turno as 'MAÑANA' | 'TARDE' | 'NOCHE',
      estado: 'CERRADA',
      registros,
      firmaBase64: signatureData,
      sincronizada: false,
    };

    // Guardar en localStorage
    const storedHojas = localStorage.getItem('pharmadix_hojas');
    const hojas: HojaTiempo[] = storedHojas ? JSON.parse(storedHojas) : [];
    hojas.push(nuevaHoja);
    localStorage.setItem('pharmadix_hojas', JSON.stringify(hojas));

    // Limpiar hoja temporal
    localStorage.removeItem('pharmadix_hoja_temp');

    toast.success('Hoja cerrada y enviada correctamente');
    setSignatureModalOpen(false);
    navigate('/dashboard');
  };

  const totalHoras = registros.reduce((sum, r) => sum + (r.horasTotales || 0), 0);
  const finalizados = registros.filter((r) => r.estado === 'FINALIZADO').length;
  const enProceso = registros.filter((r) => r.estado === 'EN_PROCESO').length;

  if (!hojaTemp) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        title={`Lote #${hojaTemp.lote.numero}`}
        showBack
        onBack={() => {
          if (registros.length > 0) {
            if (confirm('¿Desea abandonar esta hoja? Los cambios no guardados se perderán.')) {
              navigate('/dashboard');
            }
          } else {
            navigate('/dashboard');
          }
        }}
        connectionStatus={connectionStatus}
      />

      {/* Info Bar */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{hojaTemp.lote.producto}</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="open" className="gap-1">
              <Users className="h-3 w-3" />
              {registros.length}
            </Badge>
            {enProceso > 0 && (
              <Badge variant="inProgress" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {enProceso}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <PageContainer className="flex flex-col gap-4 pb-safe-bottom">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="touch"
            className="flex-col h-auto py-4 gap-2"
            onClick={() => setQrScannerOpen(true)}
          >
            <QrCode className="h-6 w-6" />
            <span>Escanear QR</span>
          </Button>
          <Button
            variant="secondary"
            size="touch"
            className="flex-col h-auto py-4 gap-2"
            onClick={() => setSearchModalOpen(true)}
          >
            <Search className="h-6 w-6" />
            <span>Buscar Manual</span>
          </Button>
        </div>

        {/* Operators List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">
              Operarios Registrados
            </h3>
            <span className="text-sm text-muted-foreground">
              {finalizados} de {registros.length} completados
            </span>
          </div>

          {registros.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Sin registros</p>
              <p className="text-sm">Escanee QR o busque un operario para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {registros.map((registro) => {
                const empleado = empleados.find((e) => e.id === registro.empleadoId);
                if (!empleado) return null;
                return (
                  <OperatorCard
                    key={registro.id}
                    registro={registro}
                    empleado={empleado}
                    onClick={() => handleOperatorCardClick(registro)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Close Sheet Button */}
        <Button
          size="action"
          className="w-full mt-4"
          onClick={handleCerrarHoja}
          disabled={registros.length === 0}
        >
          <FileCheck className="h-6 w-6" />
          Cerrar Hoja
        </Button>
      </PageContainer>

      {/* Modals */}
      <QrScannerModal
        open={qrScannerOpen}
        onOpenChange={setQrScannerOpen}
        onScan={handleQrScan}
      />

      <OperatorSearch
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        empleados={empleados}
        registeredIds={registeredIds}
        onSelect={handleOperatorSelect}
      />

      <OperatorModal
        open={operatorModalOpen}
        onOpenChange={setOperatorModalOpen}
        empleado={selectedEmpleado}
        registro={selectedRegistro}
        actividades={actividades}
        onRegistrarEntrada={handleRegistrarEntrada}
        onRegistrarSalida={handleRegistrarSalida}
      />

      <SignatureModal
        open={signatureModalOpen}
        onOpenChange={setSignatureModalOpen}
        onConfirm={handleSignatureConfirm}
        summary={{
          totalOperarios: registros.length,
          totalHoras,
        }}
      />
    </div>
  );
}
