# Bitacora de Desarrollo - Programa ACAR v2 (ACAR-2)

## Informacion General

**Proyecto:** ACAR-2 - Panel de Control Completo (Rediseño)
**Ubicacion:** `H:\ACAR2`
**Repo GitHub:** `github.com/vianntto029/ACAR-2`
**Repo anterior (v1):** `github.com/vianntto029/Formulario-Automatizado-de-Asistencia-Programa-ACAR` (carpeta `H:\ACAR`)
**Deploy:** https://acar-2-git-main-vianntto029s-projects.vercel.app
**Usuario Admin:** `fundacion2026`
**Contrasena Admin:** `acar2026`
**Firebase:** Realtime Database (`asistencias-acar`)
**Fecha inicio v2:** Mayo 2026
**Referencia grafica:** `H:\ACAR2\referencias graficas\NUEVO DISEÑO\`

---

## Sesion de Trabajo - 13 de Mayo 2026

### Problema inicial

El usuario queria continuar un rediseño completo que habia planificado previamente. Al revisar el estado real del proyecto en `H:\ACAR2`, se encontro un proyecto funcional con:
- Routing completo (9 rutas)
- Dashboard, Login, Programas, Institutos, Materias, Estadisticas, Reportes, Ajustes
- Layout con sidebar responsive
- Firebase integrado
- motion/react para animaciones
- Tailwind CSS v4 con glass morphism

Sin embargo, faltaban detalles para ser 100% fiel al diseño de referencia en `H:\ACAR2\referencias graficas\NUEVO DISEÑO\`.

### Cambios realizados

#### 1. LoginView.jsx — Corregido y mejorado
- **Problema:** Campo de contrasena duplicado (dos `<label>` de contrasena con el mismo state)
- **Solucion:** Eliminado el duplicado, corregido un solo campo
- **Agregado:** Animaciones `motion` (entrada con spring, hover scale/y, tap scale)
- **Agregado:** Boton Google con SVG de colores oficiales
- **Agregado:** Boton "Restablecer" contrasena
- **Corregido:** Year copyright a 2026
- **Usando navigate()** de react-router-dom en vez de `window.location.href`

#### 2. index.css — Paleta y tipografia corregida
- **Problema:** `body` con gradiente azul completo (deberia ser blanco, el gradiente va en main)
- **Solucion:** `body { background: white; }`, gradiente movido a Layout.jsx main area
- **Agregado:** Google Fonts (Outfit + Plus Jakarta Sans) via `@import url()`
- **Actualizado:** `--color-primary` a `#3573A3` (azul de referencia)
- **Agregado:** `--font-heading: 'Outfit'` y `--font-sans: 'Plus Jakarta Sans'`

#### 3. Layout.jsx — Sidebar y topbar mejorados
- **Agregado:** Gradiente en main: `linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 20%, #467694 100%)` con `backgroundAttachment: fixed`
- **Agregado:** Animaciones `whileHover={{ x: 4, backgroundColor: "rgba(65, 116, 144, 0.05)" }}` en TODOS los nav items del sidebar
- **Agregado:** Animaciones `whileHover/whileTap` en boton "Nuevo Registro"
- **Agregado:** Animacion `whileHover={{ x: 4 }}` en boton "Cerrar Sesion"
- **Agregado:** Topbar con links de navegacion activos con `border-b-2 border-primary`
- **Corregido:** Logo cambiado de `LOGO-ACAR.png` a `logo-fundacion.png`
- **Corregido:** Tamano logo a `w-56` (224px)
- **Corregido:** Texto "GESTION EDUCATIVA" a `text-[1.8rem]` con `font-light` en segunda linea
- **Corregido:** Footer con texto `text-white/80` para verse sobre el gradient azul
- **Agregado:** Reloj en topbar con estilo pill (rounded-full)
- **Agregado:** Mobile menu con animaciones de entrada/salida (spring transition)

#### 4. Logo Fundacion
- Copiado `logo-fundacion.png` de `referencias graficas/NUEVO DISEÑO/public/` a `H:\ACAR2\public/`
- Actualizado Layout.jsx para usar `/logo-fundacion.png`

### Build
- Compila sin errores ni warnings de sintaxis
- 2741 modulos transformados
- CSS: 57.70 KB
- JS: 1.97 MB (warning: chunk >500KB, considerar code splitting)

---

## Historial de Commits

| Commit | Descripcion |
|--------|------------|
| `8868da2` | Rediseño visual: Login con motion/animaciones, Layout con sidebar animations y logo fundacion, index.css con Google Fonts y primary #3573A3 |
| `ff19784` | Fix: add showManualListModal state, update QR URL to ACAR-2 domain |
| `797752d` | Update README for ACAR-2 panel de control with new URLs |
| `e7c5212` | Fix undefined isDownloading state in Dashboard |

---

## Arquitectura v2

### Stack Tecnologico
- **Frontend:** React 19 + Vite 8
- **Estilos:** Tailwind CSS v4 con `@theme` custom properties + glass morphism
- **Animaciones:** motion/react v12
- **Base de datos:** Firebase Realtime Database (`asistencias-acar`)
- **Despliegue:** Vercel (auto-deploy desde GitHub, repo `ACAR-2`)
- **Fuentes:** Outfit (headings) + Plus Jakarta Sans (body) via Google Fonts
- **Iconos:** Lucide React
- **Graficas:** Recharts
- **QR:** qrcode.react

### Rutas
| Ruta | Componente | Descripcion |
|------|-----------|-------------|
| `/login` | LoginView | Login con Google + email/contrasena |
| `/registro` | RegistroView | Formulario de registro para estudiantes |
| `/dashboard` | Dashboard | Panel principal con QR, tabla, stats |
| `/programas` | Programas | Gestion programas |
| `/institutos` | Institutos | Gestion institutos |
| `/materias` | Materias | Gestion materias |
| `/estadisticas` | Estadisticas | Graficas de asistencia |
| `/reportes` | Reportes | Exportacion y reportes |
| `/ajustes` | Ajustes | Perfil y configuracion |

### URLs de QR
```
https://acar-2-git-main-vianntto029s-projects.vercel.app/registro?materia=...&instituto=...
```

---

## Paleta de Colores (NUEVO DISEÑO)

| Color | Hex | Uso |
|-------|-----|-----|
| Azul referencia | `#3573A3` | Color primario principal |
| Hover rosa | `#d8629d` | Hover en botones #3573A3 |
| Verde Nuevo Registro | `#a2d2b2` | Boton "Nuevo Registro" |
| Blanco | `#FFFFFF` | Fondo, cards |
| Surface | `#f8fafb` | Fondo sidebar |
| Surface dim | `#E9EEF3` | Background alternativo |
| Surface variant | `#CCD9E1` | Bordes, separadores |
| Secondary | `#7197AE` | Texto secundario |
| Primary container | `#5B84A1` | Acentos |
| Outline | `#8EABC0` | Placeholder, iconos inactivos |
| Outline variant | `#CCD9E1` | Bordes de inputs |
| On primary container | `#e6f4ff` | Texto sobre azul |

**Fondo global:** `body` blanco, `main` con gradient `linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 20%, #467694 100%)` (fixed)

---

## Problemas Resueltos

1. **Campo password duplicado** en LoginView.jsx — dos `<label>` con mismo state, uno eliminado
2. **Body con gradiente incorrecto** — el gradiente debe estar en la main area, body es blanco
3. **Animaciones faltantes en sidebar** — nav items sin `whileHover`, agregadas una por una
4. **Logo incorrecto** — usado LOGO-ACAR.png en vez de logo-fundacion.png
5. **Build warnings** — LF/CRLF (no afectan), chunk >500KB (futura optimizacion)
6. **Login usando window.location.href** — cambiado a `navigate()` de react-router-dom

---

## Tareas Pendientes

### Criticas
- [ ] **Responsive mobile** — La app esta inutilizada en version movil. El menu hamburguesa se abre pero los componentes internos (Dashboard, tablas, cards) no son mobile-first. Prioridad alta.
- [ ] **Page Dashboard** — Integrar datos reales de Firebase en la tabla de asistencia
- [ ] **Page Programas** — Completar CRUD con Firebase
- [ ] **Page Institutos** — Completar CRUD con Firebase
- [ ] **Page Materias** — Completar CRUD con Firebase

### Importantes
- [ ] **Page Estadisticas** — Integrar datos reales de Firebase en charts
- [ ] **Page Reportes** — Integrar filtros con datos reales
- [ ] **Page Ajustes** — Form perfil funcional
- [ ] **Code splitting** — Reducir bundle de 1.97MB

### Nice to have
- [ ] Agregar mas animaciones de transicion entre paginas
- [ ] Agregar loading states con skeleton/suspense
- [ ] Notificaciones toast para acciones exitosas
- [ ] Paginacion en tablas largas
- [ ] Dark mode toggle
- [ ] Buscar/filtro global

---

## Notas Importantes

1. **No usar `&&` en PowerShell** — usar `;` para encadenar comandos
2. **LF vs CRLF** — archivos dan warnings en git, no afectan el build
3. **node_modules** — NO agregar a git (en `.gitignore`)
4. **dist/** — NO agregar a git (build output)
5. **Vercel auto-deploy** — cada push a `main` trigger deploy automatico
6. **referencias graficas/** — NO agregar a git (archivos de referencia externos)
7. **Firebase rules** — deben estar en modo test (`.read: true, .write: true`)
8. **Logo fundacion** — necesita estar en `public/` para que Vercel lo sirva

---

## Documentacion adicional

- Ver `BUENAS_PRACTICAS.md` para guias de desarrollo
- Ver `referencias graficas/NUEVO DISEÑO/src/` para el diseno de referencia completo (React + Tailwind + TypeScript)