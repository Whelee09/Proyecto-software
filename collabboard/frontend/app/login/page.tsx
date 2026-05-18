'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@collabboard.com');
  const [password, setPassword] = useState('Admin123*');
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try { await login(email, password); } catch { setError('Credenciales invalidas.'); }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-app-bg p-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-6">
        <div>
          <h1 className="text-2xl font-bold">Iniciar sesion</h1>
          <p className="mt-1 text-sm text-slate-500">Accede a tu espacio de colaboracion.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Correo" />
        <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contrasena" />
        <button className="btn btn-primary w-full">Entrar</button>
        <p className="text-center text-sm text-slate-500">No tienes cuenta? <Link className="font-semibold text-app-primary" href="/register">Registrate</Link></p>
      </form>
    </main>
  );
}

