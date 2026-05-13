# Programa ACAR - Panel de Control v2

Panel de control administrativo completo para el Programa ACAR Sabatino de la Fundacion Mochila de Sueños. Sistema de gestion de asistencia, programas, institutos, materias y reportes con diseno responsive inspirado en el NUEVO DISEÑO.

**Repositorio:** `github.com/vianntto029/ACAR-2`

---

## Acceso

| Tipo | URL |
|------|-----|
| **Panel Admin:** | https://acar-2-git-main-vianntto029s-projects.vercel.app/login |
| **Registro Estudiantil:** | https://acar-2-git-main-vianntto029s-projects.vercel.app/registro |
| **Usuario:** | `fundacion2026` |
| **Contrasena:** | `acar2026` |

---

## Modulos

| Modulo | Ruta | Descripcion |
|--------|------|-------------|
| Dashboard | `/dashboard` | Panel principal con QR, tabla de asistencia en tiempo real, stats, exportacion Excel, modales |
| Programas | `/programas` | Gestion de programas academicos con pensum |
| Institutos | `/institutos` | Gestion de institutos con servicios |
| Materias | `/materias` | Gestion de materias con temario |
| Estadisticas | `/estadisticas` | Graficas de asistencia con recharts |
| Reportes | `/reportes` | Exportacion XLSX/PDF con filtros |
| Ajustes | `/ajustes` | Perfil, notificaciones y configuracion |

---

## Tecnologias

- React 19 + Vite 8
- Tailwind CSS v4 con `@theme` custom properties + glass morphism
- motion/react v12 para animaciones
- recharts para graficas
- Firebase Realtime Database (`asistencias-acar`)
- ExcelJS para exportacion
- qrcode.react para generacion de QR
- Google Fonts: Outfit (headings) + Plus Jakarta Sans (body)

---

## Paleta de colores (NUEVO DISEÑO)

| Color | Hex | Uso |
|-------|-----|-----|
| Azul referencia | `#3573A3` | Color primario, botones, acentos |
| Hover rosa | `#d8629d` | Hover en botones azul |
| Verde Nuevo Registro | `#a2d2b2` | Boton "Nuevo Registro" |
| Blanco | `#FFFFFF` | Fondo, cards |
| Surface | `#f8fafb` | Fondo sidebar |
| Surface variant | `#CCD9E1` | Borde inputs, separadores |
| Secondary | `#7197AE` | Texto secundario |

### Gradiente Login
`linear-gradient(0deg, #3573a3 0%, #A6C4D6 40%, #FFFFFF 100%)`

### Gradiente Main Area
`linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 20%, #467694 100%)` (fijo)

---

## Comandos

```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo (localhost:5173)
npm run build        # Produccion
npm run preview      # Preview
```

---

## Estructura del proyecto

```
src/
  components/
    Layout.jsx         # Sidebar + topbar + footer responsive
  context/
    AttendanceContext.jsx  # Estado global, Firebase listeners
  pages/
    Dashboard.jsx      # QR, tabla, stats, modales
    Programas.jsx      # Grid cards + CRUD
    Institutos.jsx     # Grid cards + CRUD
    Materias.jsx       # Grid 2 columnas + CRUD
    Estadisticas.jsx   # Charts con recharts
    Reportes.jsx        # Filtros + exportar
    Ajustes.jsx        # Perfil + configuracion
  views/
    LoginView.jsx      # Login con Google + email
    RegistroView.jsx   # Formulario estudiante
  firebase.js          # Config Firebase
  App.jsx              # Router + Provider
  index.css            # Tailwind + @theme
public/
  logo-fundacion.png   # Logo Fundacion Mochila de Suenos
  LOGO-ACAR.png         # Logo ACAR
  bg-hero.jpg           # Imagen hero
```

---

## Tareas pendientes

- [ ] **Responsive mobile** — La app esta inutilizada en version movil (menu hamburguesa no funciona completamente). Requiere diseÃ±o mobile-first.
- [ ] Page Programas — Terminar CRUD completo con Firebase
- [ ] Page Institutos — Terminar CRUD completo con Firebase
- [ ] Page Materias — Terminar CRUD completo con Firebase
- [ ] Page Estadisticas — Integrar datos reales de Firebase
- [ ] Page Reportes — Integrar filtros con datos reales
- [ ] Page Ajustes — Form perfil funcional
- [ ] Code splitting — Reducir tamano del bundle ( >500KB warning)
- [ ] Subir `logo-fundacion.png` a Vercel (por ahora usa fallback placehold.co)

---

Ver `BITACORA.md` para historial completo de desarrollo, arquitectura y decisiones tecnicas.