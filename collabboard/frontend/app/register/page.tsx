'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Send } from 'lucide-react';
import { AuthExperiencePanel } from '@/components/AuthExperiencePanel';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      setSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'No fue posible crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="grid min-h-screen place-items-center p-4">
        <div className="workspace-panel w-full max-w-md space-y-4 p-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-app-ink bg-app-presence text-white shadow-tactile">
            <Send size={24} />
          </div>
          <h1 className="text-2xl font-black">Revisa tu correo</h1>
          <p className="text-sm font-medium leading-6 text-app-muted">
            Enviamos un enlace de confirmacion a <span className="font-bold text-app-ink">{email}</span>.
            Haz clic en el enlace para activar tu cuenta.
          </p>
          <Link className="btn btn-primary w-full" href="/login">Volver al inicio de sesion</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <AuthExperiencePanel />
        <section className="animate-floatIn">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg border border-app-ink bg-white text-app-ink shadow-tactile">
              <CheckCircle2 size={22} />
            </span>
            <div>
              <p className="text-xl font-black">CollabBoard</p>
              <p className="text-sm font-semibold text-app-muted">Nuevo espacio</p>
            </div>
          </div>
          <form onSubmit={submit} className="workspace-panel space-y-4 p-5 md:p-7">
            <div>
              <p className="label">Crear acceso</p>
              <h1 className="mt-2 text-3xl font-black text-app-ink md:text-4xl">Crear cuenta</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-app-muted">Registra tu usuario para gestionar equipos, proyectos y tareas.</p>
            </div>
            {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required />
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contrasena (minimo 6 caracteres)" minLength={6} required />
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarme'}
              <ArrowRight size={16} />
            </button>
            <p className="text-center text-sm font-semibold text-app-muted">Ya tienes cuenta? <Link className="font-black text-app-primary hover:text-app-ink" href="/login">Inicia sesion</Link></p>
          </form>
        </section>
      </div>
    </main>
  );
}
