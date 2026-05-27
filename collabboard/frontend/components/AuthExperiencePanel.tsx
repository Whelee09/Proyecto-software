import { CalendarDays, CheckCircle2, MessageSquare, Radio, Users } from 'lucide-react';

const lanes = [
  { label: 'Brief', value: '4 tareas', color: 'bg-app-primary' },
  { label: 'En curso', value: '7 tareas', color: 'bg-app-warning' },
  { label: 'Cierre', value: '12 listas', color: 'bg-app-presence' },
];

export function AuthExperiencePanel() {
  return (
    <section className="relative hidden min-h-[680px] overflow-hidden rounded-lg border border-app-ink bg-app-ink p-6 text-white shadow-tactile lg:block">
      <div className="surface-grid absolute inset-0 opacity-20" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase text-white/55">Vista previa</p>
            <h2 className="mt-2 max-w-md text-4xl font-black leading-tight">Equipos, tareas y eventos en un mismo lugar.</h2>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-app-ink">
            <Radio size={23} />
          </span>
        </div>

        <div className="mt-10 grid grid-cols-[0.85fr_1.15fr] gap-4">
          <div className="space-y-4">
            <article className="rounded-lg border border-white/12 bg-white p-4 text-app-ink shadow-tactile">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase text-app-muted">Equipo</p>
                <Users size={18} className="text-app-primary" />
              </div>
              <div className="mt-4 flex -space-x-2">
                {['MA', 'UX', 'QA', 'FE'].map((item) => (
                  <span key={item} className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-app-surfaceTint text-xs font-black text-app-ink">{item}</span>
                ))}
              </div>
            </article>
            <article className="rotate-[-1deg] rounded-lg border border-white/12 bg-app-warning p-4 text-app-ink shadow-tactile">
              <p className="text-xs font-black uppercase">Hoy</p>
              <p className="mt-2 text-2xl font-black">Demo 5:00 PM</p>
              <div className="mt-3 flex items-center gap-2 text-sm font-bold">
                <CalendarDays size={16} /> Sala producto
              </div>
            </article>
          </div>

          <div className="rounded-lg border border-white/12 bg-white/[0.08] p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase text-white/55">Proyecto Orion</p>
              <span className="status-chip border-white/20 bg-white/10 text-white"><span className="live-dot" /> activo</span>
            </div>
            <div className="mt-5 grid gap-3">
              {lanes.map((lane) => (
                <div key={lane.label} className="rounded-lg border border-white/12 bg-white p-3 text-app-ink shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-app-muted">{lane.label}</span>
                    <span className={`h-3 w-3 rounded-full ${lane.color}`} />
                  </div>
                  <p className="mt-2 text-lg font-black">{lane.value}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${lane.color}`} style={{ width: lane.label === 'Brief' ? '42%' : lane.label === 'En curso' ? '68%' : '88%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-4">
          <article className="rounded-lg border border-white/12 bg-white/[0.08] p-4">
            <div className="flex items-center gap-2 text-sm font-black">
              <MessageSquare size={17} /> nuevo mensaje
            </div>
            <p className="mt-2 text-sm text-white/65">"Subi el diseno final al tablero."</p>
          </article>
          <article className="rounded-lg border border-white/12 bg-white/[0.08] p-4">
            <div className="flex items-center gap-2 text-sm font-black">
              <CheckCircle2 size={17} /> listo para review
            </div>
            <p className="mt-2 text-sm text-white/65">3 entregables cerrados hoy.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
