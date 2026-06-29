# Venezuela Solidaria

> Plataforma humanitaria production-ready para coordinar donaciones internacionales y voluntariado logístico en Venezuela, con transparencia total y trazabilidad en tiempo real.

![Status](https://img.shields.io/badge/status-production--ready-00C2A8) ![Next.js](https://img.shields.io/badge/Next.js-15-0057FF) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-0057FF) ![License](https://img.shields.io/badge/license-MIT-0F172A)

## ✨ Características

- **Diseño**: Apple/Stripe/Linear/Vercel grade — minimal, lujoso, humano. Light & dark mode.
- **Donaciones**: one-time, recurrentes, corporativas, anónimas — Stripe Elements.
- **Seguimiento**: cada donación tiene un código tipo `VZS-XXXX-XXXX` con 6 etapas visibles.
- **Transparencia**: panel público con KPIs, gráficos y reportes auditados descargables.
- **Voluntarios**: registro con validación y consentimiento, gestión de turnos.
- **Solicitar ayuda**: formulario confidencial con seguimiento y notificaciones.
- **Admin panel**: gestión integral con auditoría encadenada (blockchain-ready).
- **i18n**: Español (default), Inglés y Portugués.
- **PWA**: instalable, offline-first, push notifications.
- **SEO**: Lighthouse 100 ready · JSON-LD · Open Graph · Sitemap dinámico.
- **Seguridad**: CSP · HSTS · CSRF · Rate limit · AES-256 · MFA-ready · GDPR.
- **Accesibilidad**: WCAG AA · keyboard · reduced-motion.

## 🧱 Stack

Next.js 15 · React 19 · TypeScript · TailwindCSS · shadcn-style UI · Framer Motion · GSAP · Lenis · React Query · Prisma · PostgreSQL · NextAuth v5 · Stripe · Resend · Cloudinary · Mapbox · React Hook Form · Zod · Docker · PWA.

## 🚀 Quickstart

```bash
# 1. Clona y entra
git clone https://github.com/keyderlopezpadilla-star/venezuela-progam.git
cd venezuela-progam

# 2. Instala
npm install

# 3. Configura
cp .env.example .env.local
# Edita .env.local con tus credenciales.

# 4. Prepara DB
npx prisma migrate dev
npx prisma db seed

# 5. Dev server
npm run dev
# → http://localhost:3000
```

### Docker

```bash
docker compose up --build
```

## 🧭 Estructura

```
src/
├─ app/                # Rutas Next.js (i18n)
│  ├─ [locale]/        # Locale-prefixed pages
│  ├─ api/             # API routes
│  └─ admin/           # Admin panel
├─ components/         # Atomic design
│  ├─ ui/              # shadcn-style primitives
│  ├─ atoms/, molecules/, organisms/
│  ├─ layout/          # Header, Footer, ThemeToggle
│  ├─ marketing/       # Hero, Sections
│  ├─ dashboard/       # User dashboard
│  ├─ admin/           # Admin views
│  └─ providers/       # Providers
├─ lib/                # db, auth, stripe, email, crypto, audit
├─ i18n/               # next-intl
└─ styles/             # Tailwind globals
prisma/
├─ schema.prisma       # 19 modelos, audit-ready
└─ seed.ts             # Datos iniciales
```

## 🔐 Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `RESEND_API_KEY` | Resend transactional email |
| `CLOUDINARY_*` | Cloudinary credentials |
| `ENCRYPTION_KEY` | 32 bytes base64 para cifrado AES-256 |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox token (opcional) |

Ver `.env.example` completo.

## 🧪 Scripts

```bash
npm run dev          # Desarrollo con Turbo
npm run build        # Build de producción
npm run start        # Producción
npm run lint
npm run typecheck
npm run prisma:studio
npm run prisma:seed
npm run test
npm run test:e2e
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. Framework Preset: **Next.js** (se detecta automáticamente).
3. Configura **todas** las variables de entorno listadas en `.env.example`.
4. Provisiona una base de datos PostgreSQL (Neon, Supabase o Railway).
5. Build command: `prisma generate && next build` (ya configurado en `package.json`).
6. Apunta tu dominio personalizado.
7. Configura el webhook de Stripe apuntando a `https://tudominio.com/api/webhooks/stripe`.

> ⚠️ Nunca subas archivos `.env.local` al repositorio. Las keys van exclusivamente en el panel de Vercel.

### Docker / VPS

```bash
docker compose up -d
```

## 🤝 Contribución

Pull requests bienvenidos. Para cambios grandes abre primero un issue.

### ¿Cómo contribuir?

1. Haz fork del repositorio.
2. Crea una rama: `git checkout -b feature/tu-mejora`.
3. Realiza tus cambios y haz commit: `git commit -m "feat: descripción"`.
4. Push a tu rama: `git push origin feature/tu-mejora`.
5. Abre un Pull Request.

## 👥 Colaboradores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/keyderlopezpadilla-star">
        <img src="https://github.com/keyderlopezpadilla-star.png" width="80" style="border-radius:50%;" alt="Keyder López Padilla"/><br />
        <sub><b>Keyder López Padilla</b></sub>
      </a><br />
      <sub>Fundador & Desarrollador Principal</sub>
    </td>
    <!-- Agrega más colaboradores aquí -->
    <!--
    <td align="center">
      <a href="https://github.com/username">
        <img src="https://github.com/username.png" width="80" style="border-radius:50%;" alt="Nombre"/><br />
        <sub><b>Nombre</b></sub>
      </a><br />
      <sub>Rol</sub>
    </td>
    -->
  </tr>
</table>

¿Quieres ser parte del equipo? Revisa los [issues abiertos](https://github.com/keyderlopezpadilla-star/venezuela-progam/issues) o contáctanos.

## 📜 Licencia

MIT — Venezuela Solidaria Foundation.

---

**Construido con propósito. Diseñado con dignidad. Desplegado con transparencia.**