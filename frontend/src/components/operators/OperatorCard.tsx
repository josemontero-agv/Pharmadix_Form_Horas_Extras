import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RegistroTiempo, Empleado } from '@/types/pharmadix';
import { Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OperatorCardProps {
  registro: RegistroTiempo;
  empleado: Empleado;
  onClick?: () => void;
}

export function OperatorCard({ registro, empleado, onClick }: OperatorCardProps) {
  const getStatusBadge = () => {
    switch (registro.estado) {
      case 'PENDIENTE':
        return <Badge variant="pending">Pendiente</Badge>;
      case 'EN_PROCESO':
        return <Badge variant="inProgress">En Proceso</Badge>;
      case 'FINALIZADO':
        return <Badge variant="success">Finalizado</Badge>;
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  const formatHours = (hours: number | null) => {
    if (hours === null) return '';
    return `${hours.toFixed(1)}h`;
  };

  return (
    <div
      className={cn(
        'operator-card cursor-pointer animate-slide-up',
        onClick && 'hover:border-primary/30'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 border-2 border-muted">
          <AvatarImage src={empleado.foto} alt={empleado.nombre} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {empleado.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-foreground truncate">{empleado.nombre}</h4>
              <p className="text-sm text-muted-foreground">#{empleado.gafete} · {empleado.puesto}</p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-success" />
              <span className="text-muted-foreground">Entrada:</span>
              <span className={cn('font-medium', registro.horaEntrada ? 'text-foreground' : 'text-muted-foreground')}>
                {formatTime(registro.horaEntrada)}
              </span>
            </div>

            {registro.estado !== 'PENDIENTE' && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={cn('h-4 w-4', registro.horaSalida ? 'text-warning' : 'text-muted-foreground')} />
                <span className="text-muted-foreground">Salida:</span>
                <span className={cn('font-medium', registro.horaSalida ? 'text-foreground' : 'text-muted-foreground')}>
                  {formatTime(registro.horaSalida)}
                </span>
              </div>
            )}

            {registro.estado === 'FINALIZADO' && registro.horasTotales && (
              <div className="ml-auto">
                <Badge variant="outline" className="font-bold">
                  {formatHours(registro.horasTotales)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
