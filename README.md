# FiberPro Dashboard (Supabase + Vite)

Dashboard comercial con roles (admin, presenter, viewer) usando Supabase Auth, Postgres, Storage y Edge Functions.

## Configuración rápida

1. Copia `.env.example` a `.env` y agrega:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

2. En Supabase SQL Editor ejecuta `supabase/schema.sql`.
3. Despliega la Edge Function `admin-create-user` con las variables:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Corre la app:

```
npm install
npm run dev
```

## Flujos principales

- `/login` para autenticación.
- `/` lista dashboards publicados (viewer).
- `/presenter` y `/presenter/new` para cargar Excel y crear dashboards.
- `/dashboard/:id` para visualizar dashboards (y publicar si eres presenter del dashboard).
- `/admin/users` para crear usuarios y asignar roles.

## Usuarios de prueba sugeridos

- admin@fiberpro.com (admin)
- rous@fiberpro.com (presenter)
- eve@fiberpro.com (viewer)

## Notas sobre Supabase

- No se expone la Service Role Key en el frontend.
- La Edge Function `admin-create-user` valida que quien llama sea admin.
- Las policies de RLS y Storage están en `supabase/schema.sql`.

## Sobre Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
