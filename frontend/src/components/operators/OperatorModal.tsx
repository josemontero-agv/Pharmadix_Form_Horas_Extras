import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Empleado, RegistroTiempo, Actividad } from '@/types/pharmadix';
import { LogIn, LogOut, Clock, X } from 'lucide-react';

interface OperatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado: Empleado | null;
  registro: RegistroTiempo | null;
  actividades: Actividad[];
  onRegistrarEntrada: (empleadoId: string, actividad: string) => void;
  onRegistrarSalida: (registroId: string) => void;
}

export function OperatorModal({
  open,
  onOpenChange,
  empleado,
  registro,
  actividades,
  onRegistrarEntrada,
  onRegistrarSalida,
}: OperatorModalProps) {
  const [selectedActividad, setSelectedActividad] = useState<string>('');

  if (!empleado) return null;

  const isNewRegistro = !registro || registro.estado === 'PENDIENTE';
  const isEnProceso = registro?.estado === 'EN_PROCESO';
  const isFinalizado = registro?.estado === 'FINALIZADO';

  const handleEntrada = () => {
    if (selectedActividad) {
      onRegistrarEntrada(empleado.id, selectedActividad);
      setSelectedActividad('');
      onOpenChange(false);
    }
  };

  const handleSalida = () => {
    if (registro) {
      onRegistrarSalida(registro.id);
      onOpenChange(false);
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Registrar Tiempo
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg">
            <AvatarImage src={empleado.foto} alt={empleado.nombre} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {empleado.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <h3 className="mt-4 text-xl font-bold text-center">{empleado.nombre}</h3>
          <p className="text-muted-foreground">#{empleado.gafete} · {empleado.puesto}</p>

          <div className="mt-3">
            {isNewRegistro && <Badge variant="pending">Sin registro</Badge>}
            {isEnProceso && <Badge variant="inProgress">En Proceso</Badge>}
            {isFinalizado && <Badge variant="success">Finalizado</Badge>}
          </div>

          {isEnProceso && registro && (
            <div className="mt-4 p-3 bg-success/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Entrada registrada</p>
              <p className="text-2xl font-bold text-success">{formatTime(registro.horaEntrada)}</p>
              <p className="text-xs text-muted-foreground mt-1">{registro.actividad}</p>
            </div>
          )}

          {isFinalizado && registro && (
            <div className="mt-4 p-4 bg-muted rounded-lg w-full">
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Entrada</p>
                  <p className="text-lg font-bold text-success">{formatTime(registro.horaEntrada)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Salida</p>
                  <p className="text-lg font-bold text-warning">{formatTime(registro.horaSalida)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-primary">{registro.horasTotales?.toFixed(1)}h</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {isNewRegistro && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Actividad
              </label>
              <Select value={selectedActividad} onValueChange={setSelectedActividad}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar actividad..." />
                </SelectTrigger>
                <SelectContent>
                  {actividades.map((act) => (
                    <SelectItem key={act.id} value={act.nombre}>
                      {act.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="entry"
              size="action"
              className="w-full"
              disabled={!selectedActividad}
              onClick={handleEntrada}
            >
              <LogIn className="h-6 w-6" />
              REGISTRAR ENTRADA
            </Button>
          </div>
        )}

        {isEnProceso && (
          <Button
            variant="exit"
            size="action"
            className="w-full"
            onClick={handleSalida}
          >
            <LogOut className="h-6 w-6" />
            REGISTRAR SALIDA
          </Button>
        )}

        {isFinalizado && (
          <div className="text-center py-2">
            <p className="text-muted-foreground text-sm">
              Este operario ya completó su registro.
            </p>
          </div>
        )}

        <Button variant="ghost" className="mt-2" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4 mr-2" />
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
