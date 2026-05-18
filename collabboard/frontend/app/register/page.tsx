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
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try { await register(name, email, password); } catch { setError('No fue posible crear la cuenta.'); }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-app-bg p-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-6">
        <div>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">Empieza a colaborar con tu equipo.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" />
        <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Correo" />
        <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contrasena" />
        <button className="btn btn-primary w-full">Registrarme</button>
        <p className="text-center text-sm text-slate-500">Ya tienes cuenta? <Link className="font-semibold text-app-primary" href="/login">Inicia sesion</Link></p>
      </form>
    </main>
  );
}

