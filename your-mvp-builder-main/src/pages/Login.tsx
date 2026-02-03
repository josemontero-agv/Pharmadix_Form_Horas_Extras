import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de login
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (credentials.username && credentials.password) {
      toast.success('Bienvenido a Pharmadix Times');
      navigate('/dashboard');
    } else {
      toast.error('Por favor complete todos los campos');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80 flex flex-col items-center justify-center p-4">
      {/* Logo and Brand */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="bg-primary-foreground p-4 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <img 
            src="/logo-pharmadix.png" 
            alt="Pharmadix Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">
          Pharmadix Times
        </h1>
        <p className="text-primary-foreground/70 mt-1">
          Gestión de Tiempos de Producción
        </p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-sm shadow-2xl animate-slide-up">
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  className="pl-10"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  className="pl-10 pr-10"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Ingresando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-primary-foreground/50 text-sm">
        © 2026 Pharmadix. Todos los derechos reservados.
      </p>
    </div>
  );
}
