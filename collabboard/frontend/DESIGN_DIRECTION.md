# CollabBoard UI Direction

## Diagnostico Rapido

El frontend actual funciona, pero se siente plano porque casi todo vive en `white/slate/blue`, con tarjetas genericas, poco estado visual, pocas senales de colaboracion en vivo y estados vacios demasiado literales.

La oportunidad no es hacer una landing bonita. La oportunidad es que la app se sienta como una sala de trabajo viva: tareas, equipos, archivos, mensajes y calendario conectados en una misma superficie.

## Direccion Recomendada

**Live Studio Grid**

Una interfaz de colaboracion tipo estudio: ordenada como una grilla funcional, tactil como un tablero de trabajo, y viva mediante presencia, estados, actividad reciente y microinteracciones.

Influencias:

- De Stijl y Bauhaus: grillas, geometria funcional, asimetria con orden, color como senal.
- Collage humano: etiquetas, notas, pines, actividad y artefactos de equipo.
- UI espacial/motion-driven: capas, profundidad y movimiento para explicar cambios de estado.

## Paleta Base

Usar colores por rol, no por decoracion:

| Rol | Hex | Uso |
| --- | --- | --- |
| Ink | `#111318` | Texto principal, lineas fuertes |
| Canvas | `#F6F8F3` | Fondo general, con uso moderado |
| Surface | `#FFFFFF` | Superficies principales |
| Border | `#D9E0EA` | Separadores y bordes |
| Brand | `#255DE3` | Acciones primarias, nav activo |
| Presence | `#00A896` | En vivo, miembros, colaboracion |
| Urgent | `#FF5A5F` | Urgente, error, destructivo |
| Due | `#F4B000` | Fechas limite, advertencias |
| Discovery | `#7C5CFF` | Onboarding, novedades, tips |
| Complete | `#24A148` | Exito, completado |

## Librerias Recomendadas

Mantener Next.js, React, Tailwind y lucide-react. Agregar solo lo que resuelva una necesidad clara:

- `shadcn/ui`: primera opcion para componentes editables con Tailwind: Button, Dialog, Popover, Tabs, Tooltip, Badge, Avatar, Input, DropdownMenu, Sheet.
- `motion`: transiciones y microinteracciones con continuidad visual.
- `@tanstack/react-query`: carga, cache, invalidacion y mutaciones optimistas para API.
- `@dnd-kit/core` y `@dnd-kit/sortable`: Kanban real con drag-and-drop accesible.
- `react-aria-components`: controles complejos con accesibilidad fuerte, especialmente calendarios, menus, tablas, selects y comboboxes.

## Roadmap Visual

1. Foundation visual:
   - Rehacer tokens de Tailwind.
   - Mejorar `.btn`, `.input`, `.card`, badges, focus rings y estados vacios.
   - Convertir `AppShell` en una superficie de trabajo mas viva.

2. Pantallas firma:
   - Dashboard como centro de comando, no solo metricas.
   - Kanban tactil con columnas, estados y movimiento.
   - Login/register con preview real de la experiencia.

3. Colaboracion:
   - Chat con contexto de canal, presencia y composer mas fuerte.
   - Calendario con color por proyecto/equipo y eventos compactos.
   - Files con dropzone y stream de artefactos recientes.
   - Teams/projects con actividad, miembros y siguiente accion.

## Reglas de Calidad

- Nada de blobs, gradientes genericos o glassmorphism morado como fondo principal.
- Las tarjetas deben representar objetos reales: tarea, equipo, proyecto, evento, archivo, mensaje.
- Cada pantalla debe tener loading, empty, error, hover, active, focus-visible y disabled cuando aplique.
- Mantener contraste AA cuando sea posible: 4.5:1 para texto normal.
- Acciones principales con targets practicos de 40-44px y minimo WCAG de 24x24px.
- Respetar `prefers-reduced-motion`.
- Verificar mobile como composicion propia, no como desktop comprimido.
