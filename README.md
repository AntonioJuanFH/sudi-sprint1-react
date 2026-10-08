# S.U.D.I. — Sistema Único de Información (Residencial Los Robles)

Plataforma web para la gestión del Residencial Los Robles, desarrollada con **React** siguiendo
la metodología ágil **Scrum** (materia Proyecto 2, UDG Virtual). El proyecto parte de la EDT/WBS
documentada en Proyecto 1 y de un Product Backlog de 14 historias de usuario organizadas en 3 sprints.

## Estado del proyecto por sprint

| Sprint | Historias | Puntos | Estado en este repositorio |
|---|---|---|---|
| Sprint 1 | HU-01 a HU-05 (usuarios, roles, login, cuotas, estado de cuenta) | 19 | **Completado** (con ajustes de revisión) |
| Sprint 2 | HU-06 a HU-10 (pagos, notificaciones, reportes, avisos) | 17 | Planificado — se desarrolla en la siguiente fase |
| Sprint 3 | HU-11 a HU-14 (emergencias, incidencias, mantenimiento, votaciones) | 23 | Planificado — se desarrolla en la fase posterior |

Avance acumulado: 19 de 59 puntos (32 %). Este repositorio solo contiene código de los sprints
marcados como completados; los demás se irán agregando conforme se desarrollen.

## Sprint 1 — historias implementadas

| Historia | Componente (`src/App.jsx`) | Qué hace |
|---|---|---|
| HU-01 Registro de residentes | `RegistroResidentes` | Valida campos obligatorios, contraseña de mínimo 4 caracteres y correo duplicado |
| HU-02 Roles y permisos | `RolesPermisos`, `ACCESS`, `canAccess` | Asigna roles y restringe cada sección según el rol; muestra la matriz de permisos |
| HU-03 Inicio de sesión | `Login` | Valida correo y contraseña; recuperación de contraseña simulada |
| HU-04 Cuotas y adeudos | `Cuotas` | Registra cuotas por residente, mes y monto; control de pagado/pendiente |
| HU-05 Estado de cuenta | `EstadoCuenta` | Calcula total pagado y adeudo; el residente solo ve su propia cuenta |

## Ajustes del Sprint 1 (revisión)

- **A5 (HU-01):** la contraseña se valida (mínimo 4 caracteres).
- **A6 (HU-02):** cada rol solo accede a sus secciones; las restringidas muestran un candado.
- **A7 (HU-02):** el cambio de rol se refleja de inmediato en la sesión abierta.
- **A8 (HU-01/03):** el correo se normaliza (espacios y mayúsculas) al registrar y al iniciar sesión.
- **A9 (HU-05):** un residente solo puede consultar su propio estado de cuenta.

### Matriz de permisos

| Sección | Presidente | Tesorera | Secretario | Residente | Sin sesión |
|---|:-:|:-:|:-:|:-:|:-:|
| Registro de residentes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Inicio de sesión | ✓ | ✓ | ✓ | ✓ | ✓ |
| Roles y permisos | ✓ | — | — | — | — |
| Cuotas y adeudos | ✓ | ✓ | — | — | — |
| Estado de cuenta | ✓ | ✓ | ✓ | ✓ | — |

## Cuentas de prueba (contraseña `1234`)

| Rol | Correo |
|---|---|
| Presidente | ana.torres@losrobles.mx |
| Tesorera | carlos.medina@losrobles.mx |
| Secretario | marta.reyes@losrobles.mx |
| Residente | jorge.paredes@losrobles.mx |

## Cómo ejecutarlo

Requiere [Node.js](https://nodejs.org/) 18 o superior.

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

## Limitaciones conocidas

- El estado vive en memoria (`useState`): al recargar la página los datos vuelven a los valores iniciales.
- La recuperación de contraseña es una simulación; no envía correos reales.
- Las contraseñas se guardan en texto plano dentro del estado de la demo; en producción se usaría
  autenticación con cifrado y una base de datos.

## Stack técnico

React 18 · Vite · Tailwind CSS · lucide-react

## Autor

Juan Antonio Fuentes Herrera — Licenciatura en Desarrollo de Sistemas Web, UDG Virtual.
Proyecto base (EDT / WBS): equipo S.U.D.I. de Proyecto 1.
