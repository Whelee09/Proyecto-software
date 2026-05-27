'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { AuthExperiencePanel } from '@/components/AuthExperiencePanel';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Credenciales invalidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try { await loginWithGoogle(); } catch { setError('No fue posible iniciar con Google.'); }
  };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <AuthExperiencePanel />
        <section className="animate-floatIn">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg border border-app-ink bg-white text-app-ink shadow-tactile">
              <ShieldCheck size={22} />
            </span>
            <div>
              <p className="text-xl font-black">CollabBoard</p>
              <p className="text-sm font-semibold text-app-muted">Cuenta de usuario</p>
            </div>
          </div>
          <form onSubmit={submit} className="workspace-panel space-y-4 p-5 md:p-7">
            <div>
              <p className="label">Entrada segura</p>
              <h1 className="mt-2 text-3xl font-black text-app-ink md:text-4xl">Iniciar sesion</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-app-muted">Accede a tus equipos, proyectos, mensajes y calendario.</p>
            </div>
            {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contrasena" required />
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
              <ArrowRight size={16} />
            </button>
            <div className="relative flex items-center gap-2">
              <hr className="flex-1 border-app-border" />
              <span className="text-xs font-black uppercase text-app-muted">o continua con</span>
              <hr className="flex-1 border-app-border" />
            </div>
            <button type="button" onClick={handleGoogle} className="btn btn-secondary w-full">
              <Mail size={16} />
              Google
            </button>
            <p className="text-center text-sm font-semibold text-app-muted">No tienes cuenta? <Link className="font-black text-app-primary hover:text-app-ink" href="/register">Registrate</Link></p>
          </form>
        </section>
      </div>
    </main>
  );
}
