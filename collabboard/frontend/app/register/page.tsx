'use client';

import Link from 'next/link';
import { useState } from 'react';
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
      <main className="grid min-h-screen place-items-center bg-app-bg p-4">
        <div className="card w-full max-w-md space-y-4 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">✉</div>
          <h1 className="text-xl font-bold">Revisa tu correo</h1>
          <p className="text-sm text-slate-500">
            Enviamos un enlace de confirmacion a <span className="font-medium text-slate-700">{email}</span>.
            Haz clic en el enlace para activar tu cuenta.
          </p>
          <Link className="btn btn-primary w-full inline-block text-center" href="/login">Volver al inicio de sesion</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-app-bg p-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-6">
        <div>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">Empieza a colaborar con tu equipo.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required />
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contrasena (minimo 6 caracteres)" minLength={6} required />
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
        <p className="text-center text-sm text-slate-500">Ya tienes cuenta? <Link className="font-semibold text-app-primary" href="/login">Inicia sesion</Link></p>
      </form>
    </main>
  );
}
