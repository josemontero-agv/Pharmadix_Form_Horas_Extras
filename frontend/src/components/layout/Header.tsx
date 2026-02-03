import { Wifi, WifiOff, RefreshCw, ArrowLeft, Menu } from 'lucide-react';
import { ConnectionStatus } from '@/types/pharmadix';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  connectionStatus: ConnectionStatus;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function Header({
  title = 'Pharmadix Times',
  showBack = false,
  onBack,
  connectionStatus,
  showMenu = false,
  onMenuClick,
}: HeaderProps) {
  const statusConfig = {
    online: {
      icon: Wifi,
      text: 'Online',
      className: 'text-success-foreground bg-success/20',
      dotClassName: 'bg-success-foreground',
    },
    offline: {
      icon: WifiOff,
      text: 'Offline',
      className: 'text-primary-foreground/70 bg-primary-foreground/10',
      dotClassName: 'bg-primary-foreground/50',
    },
    syncing: {
      icon: RefreshCw,
      text: 'Sincronizando',
      className: 'text-warning-foreground bg-warning/20',
      dotClassName: 'bg-warning-foreground animate-pulse',
    },
  };

  const status = statusConfig[connectionStatus];
  const StatusIcon = status.icon;

  return (
    <header className="pharmadix-header safe-top sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-1">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
        {showMenu && !showBack && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            aria-label="Menú"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="bg-primary-foreground p-1 rounded-lg flex items-center justify-center">
            <img 
              src="/logo-pharmadix.png" 
              alt="PX" 
              className="h-6 w-auto object-contain"
            />
          </div>
          <h1 className="text-lg font-bold tracking-tight">{title}</h1>
        </div>
      </div>

      <div
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          status.className
        )}
      >
        <div className={cn('w-1.5 h-1.5 rounded-full', status.dotClassName)} />
        <StatusIcon className={cn('h-3.5 w-3.5', connectionStatus === 'syncing' && 'animate-spin')} />
        <span className="hidden sm:inline">{status.text}</span>
      </div>
    </header>
  );
}
