import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Empleado } from '@/types/pharmadix';
import { Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OperatorSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleados: Empleado[];
  registeredIds: string[];
  onSelect: (empleado: Empleado) => void;
}

export function OperatorSearch({
  open,
  onOpenChange,
  empleados,
  registeredIds,
  onSelect,
}: OperatorSearchProps) {
  const [search, setSearch] = useState('');

  const filteredEmpleados = useMemo(() => {
    if (!search.trim()) return empleados;
    const query = search.toLowerCase();
    return empleados.filter(
      (emp) =>
        emp.nombre.toLowerCase().includes(query) ||
        emp.gafete.includes(query) ||
        emp.puesto.toLowerCase().includes(query)
    );
  }, [empleados, search]);

  const handleSelect = (empleado: Empleado) => {
    onSelect(empleado);
    setSearch('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Buscar Operario
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nombre o número de gafete..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2 space-y-2 min-h-[300px] max-h-[400px]">
          {filteredEmpleados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mb-3 opacity-30" />
              <p>No se encontraron operarios</p>
            </div>
          ) : (
            filteredEmpleados.map((empleado) => {
              const isRegistered = registeredIds.includes(empleado.id);
              return (
                <button
                  key={empleado.id}
                  onClick={() => handleSelect(empleado)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                    'hover:bg-accent focus:bg-accent focus:outline-none',
                    isRegistered && 'opacity-60'
                  )}
                >
                  <Avatar className="h-12 w-12 border-2 border-muted">
                    <AvatarImage src={empleado.foto} alt={empleado.nombre} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {empleado.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{empleado.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      #{empleado.gafete} · {empleado.puesto}
                    </p>
                  </div>
                  {isRegistered && (
                    <span className="text-xs text-warning font-medium px-2 py-1 bg-warning/10 rounded-full">
                      Registrado
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
