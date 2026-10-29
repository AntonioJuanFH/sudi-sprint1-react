# S.U.D.I. — Sistema Único de Información (Residencial Los Robles)

Plataforma web para la gestión del Residencial Los Robles, desarrollada con **React** siguiendo
la metodología ágil **Scrum** (materia Proyecto 2, UDG Virtual). El proyecto parte de la EDT/WBS
documentada en Proyecto 1 y de un Product Backlog de 14 historias de usuario organizadas en 3 sprints.

## Estado del proyecto por sprint

| Sprint | Historias | Puntos | Estado en este repositorio |
|---|---|---|---|
| Sprint 1 | HU-01 a HU-05 (usuarios, roles, login, cuotas, estado de cuenta) | 19 | **Completado** (con ajustes de revisión A5–A9) |
| Sprint 2 | HU-06 a HU-10 (pagos, notificaciones, reportes, avisos) | 17 | **Completado** (con ajustes A11–A17) |
| Sprint 3 | HU-11 a HU-14 (emergencias, incidencias, mantenimiento, votaciones) | 23 | **Completado** (con ajustes A19–A22) |

Avance acumulado: 59 de 59 puntos (100 %). Este repositorio contiene el código de los tres sprints;
el código y la documentación coinciden con lo reportado en el Sprint Schedule.

## Sprint 1 — historias implementadas

| Historia | Componente (`src/App.jsx`) | Qué hace |
|---|---|---|
| HU-01 Registro de residentes | `RegistroResidentes` | Valida campos obligatorios, contraseña de mínimo 4 caracteres y correo duplicado |
| HU-02 Roles y permisos | `RolesPermisos`, `ACCESS`, `canAccess` | Asigna roles y restringe cada sección según el rol; muestra la matriz de permisos |
| HU-03 Inicio de sesión | `Login` | Valida correo y contraseña; recuperación de contraseña simulada |
| HU-04 Cuotas y adeudos | `Cuotas` | Registra cuotas por residente, mes, monto y **fecha límite de pago** |
| HU-05 Estado de cuenta | `EstadoCuenta` | Calcula total pagado y adeudo; muestra estatus, fecha límite y recibo; el residente solo ve su cuenta |

## Sprint 2 — historias implementadas

| Historia | Componente (`src/App.jsx`) | Qué hace |
|---|---|---|
| HU-06 Validación de pagos | `Pagos` | El residente adjunta un comprobante (imagen o PDF) y la cuota queda “En validación”; Tesorera o Presidente validan o rechazan (con motivo); solo al validar la cuota pasa a “Pagada” y se emite un recibo |
| HU-07 Notificaciones de adeudo | `Adeudos` | Identifica cuotas vencidas sin pago, lista a los residentes morosos y genera notificaciones de adeudo y recordatorios (cuotas que vencen en 3 días), una por cuota al día |
| HU-08 Reportes de recaudación | `Reportes` | Totales esperado / recaudado / pendiente por periodo, desglose por vivienda, exportación a CSV e impresión o guardado como PDF |
| HU-09 Avisos generales | `PublicarAvisos`, `Avisos` | Secretario o Presidente publican avisos con título y contenido; los residentes los ven del más reciente al más antiguo |
| HU-10 Notificaciones urgentes | `PublicarAvisos`, `Avisos` | La mesa directiva marca una publicación como urgente; se muestra destacada (también como banner en todas las secciones) y registra fecha y hora; historial de publicaciones |

## Sprint 3 — historias implementadas

| Historia | Componente (`src/App.jsx`) | Qué hace |
|---|---|---|
| HU-11 Directorio de emergencia | `Emergencias` | Todos los usuarios con sesión consultan los números de emergencia; botón de contacto rápido (`tel:`) a la caseta de vigilancia; la mesa directiva agrega, edita y elimina contactos desde su panel |
| HU-12 Registro de incidencias | `Incidencias` | El residente registra una incidencia por tipo (alumbrado, seguridad, limpieza u otro); la mesa cambia el estatus (pendiente, en atención, resuelta); el residente ve solo sus incidencias con su estatus e historial |
| HU-13 Solicitudes de mantenimiento | `Mantenimiento`, `FilaMantenimiento` | El residente describe el problema y envía la solicitud; la mesa asigna responsable y da seguimiento (solicitada, asignada, en proceso, concluida); al concluir, el residente recibe una notificación |
| HU-14 Votaciones y encuestas | `Votaciones`, `TarjetaVotacion` | La mesa crea una votación con pregunta, opciones y fecha de cierre; cada residente vota una sola vez; al cerrarse (por fecha o manualmente) se muestran conteo y porcentaje automáticamente |

## Ajustes


**Revisión del Sprint 1 (A5–A9)**

- **A5 (HU-01):** la contraseña se valida (mínimo 4 caracteres).
- **A6 (HU-02):** cada rol solo accede a sus secciones; las restringidas muestran un candado.
- **A7 (HU-02):** el cambio de rol se refleja de inmediato en la sesión abierta.
- **A8 (HU-01/03):** el correo se normaliza (espacios y mayúsculas) al registrar y al iniciar sesión.
- **A9 (HU-05):** un residente solo puede consultar su propio estado de cuenta.

**Sprint 2 (A11–A17)**

- **A11 (HU-04):** la fecha límite de pago es obligatoria en cada cuota (pendiente P1 del Sprint 1).
- **A12 (HU-06):** el comprobante solo acepta imagen o PDF.
- **A13 (HU-06):** una cuota solo pasa a pagada por validación o por pago en ventanilla registrado; se retira el cambio libre pagado/pendiente del Sprint 1.
- **A14 (HU-06):** nadie puede validar su propio comprobante (separación de funciones).
- **A15 (HU-07):** además de los adeudos vencidos, se genera un recordatorio a las cuotas que vencen en 3 días.
- **A16 (HU-08):** el reporte se puede exportar a CSV e imprimir o guardar como PDF.
- **A17 (HU-10):** historial de avisos y notificaciones urgentes publicados.

**Sprint 3 (A19–A22)**

- **A19 (HU-13 / HU-07):** las notificaciones se generalizan: además de adeudos y recordatorios, el residente recibe el aviso de mantenimiento concluido; la sección se renombra “Mis notificaciones”.
- **A20 (HU-14):** el conteo solo se muestra al cerrar la votación y cada residente tiene un solo voto, para no influir en la decisión.
- **A21 (HU-12 / HU-13):** las incidencias guardan historial de estatus; una solicitud de mantenimiento no puede asignarse sin indicar responsable.
- **A22 (P3):** el Sprint 3 inició por HU-14 (la más grande) y se reservó tiempo para pruebas.

### Matriz de permisos

| Sección | Presidente | Tesorera | Secretario | Residente | Sin sesión |
|---|:-:|:-:|:-:|:-:|:-:|
| Registro de residentes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Inicio de sesión | ✓ | ✓ | ✓ | ✓ | ✓ |
| Roles y permisos | ✓ | — | — | — | — |
| Cuotas y adeudos | ✓ | ✓ | — | — | — |
| Estado de cuenta | ✓ | ✓ | ✓ | ✓ | — |
| Pagos y comprobantes (enviar) | ✓ | ✓ | ✓ | ✓ | — |
| Pagos y comprobantes (validar) | ✓ | ✓ | — | — | — |
| Adeudos y notificaciones | ✓ | ✓ | — | — | — |
| Reportes de recaudación | ✓ | ✓ | ✓ | — | — |
| Avisos y notificaciones (ver) | ✓ | ✓ | ✓ | ✓ | — |
| Publicar aviso general | ✓ | — | ✓ | — | — |
| Publicar notificación urgente | ✓ | ✓ | ✓ | — | — |

## Equipo y responsabilidades

Historias asignadas en el Product Backlog y en el Sprint Schedule de cada sprint (horas estimadas y puntos de historia).

| Integrante | Rol | Historias | Puntos | Horas |
|---|---|---|:-:|:-:|
| Juan Antonio Fuentes Herrera | Developer (integración del repositorio) | HU-01, HU-03, HU-06, HU-10, HU-12 y pendiente P1 | 19 | 78 |
| Jorge Eduardo Ledesma Cruz | Developer | HU-02, HU-08, HU-11 | 13 | 52 |
| Melissa Suzette Jimenez Alvarado | Developer | HU-04, HU-07, HU-13 | 13 | 52 |
| Jorge Luis Espinosa Acosta | Developer | HU-05, HU-09, HU-14 | 14 | 56 |
| Diego Said Viveros | Product Owner | Revisión de los sprints | — | — |
| Ana Hernández | Scrum Master | Revisión de los sprints | — | — |

El código de los tres sprints se integra en este repositorio desde la cuenta del Developer; la autoría de cada historia
corresponde al integrante indicado en la tabla.

## Cuentas de prueba (contraseña `1234`)

| Rol | Correo |
|---|---|
| Presidente | ana.torres@losrobles.mx |
| Tesorera | carlos.medina@losrobles.mx |
| Secretario | marta.reyes@losrobles.mx |
| Residente | jorge.paredes@losrobles.mx |

Flujo sugerido para probar el Sprint 2: entra como Jorge → *Pagos y comprobantes* → adjunta un PDF o imagen;
entra como Carlos → *Pagos y comprobantes* → valida el pago; en *Adeudos y notificaciones* genera las
notificaciones; como Ana abre *Reportes de recaudación*; como Marta o Carlos publica un aviso en *Publicar avisos*.

Flujo sugerido para probar el Sprint 3: como Jorge abre *Registro de incidencias* y registra una; entra como Marta y
cambia su estatus; como Jorge solicita un mantenimiento, como Carlos asigna responsable y lo marca “Concluida”, y Jorge
ve la notificación en *Avisos*; como Ana crea una votación, los residentes votan y Ana la cierra para ver el conteo.

Pruebas automáticas (opcionales, solo locales): 25 pruebas con Vitest y Testing Library cubren los criterios de aceptación
de los tres sprints.

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
- Incidencias, solicitudes de mantenimiento y votos viven en memoria igual que el resto de los datos; no hay persistencia (pendiente P4 para futuras iteraciones).
- El botón de contacto rápido usa un enlace `tel:`; solo marca en dispositivos con telefonía.
- Las notificaciones se muestran dentro de la plataforma; no se envían por correo ni mensaje.
- Del comprobante solo se guardan nombre, tipo y método; el archivo no se almacena (no hay servidor).
- La fecha de referencia de vencimientos es la del reloj del navegador.
- Las contraseñas se guardan en texto plano dentro del estado de la demo; en producción se usaría
  autenticación con cifrado y una base de datos.

## Stack técnico

React 18 · Vite · Tailwind CSS · lucide-react

## Autor

Juan Antonio Fuentes Herrera — Licenciatura en Desarrollo de Sistemas Web, UDG Virtual.
Proyecto base (EDT / WBS): equipo S.U.D.I. de Proyecto 1.
