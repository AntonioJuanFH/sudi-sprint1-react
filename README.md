# S.U.D.I. — Sprint 1 (Demo funcional)

Sistema Único de Información para el **Residencial Los Robles**.
Este repositorio contiene el código del **Sprint 1** del proyecto S.U.D.I., desarrollado para la
actividad integradora *"Sprint, el corazón de Scrum"* de la materia Proyecto 2 (metodología ágil
Scrum), UDG Plus.

El proyecto completo (EDT, Product Backlog, Sprint Backlog) se documentó previamente en las
actividades de Proyecto 1 y Proyecto 2. Este código implementa, en React, las cinco historias de
usuario que integraron el Sprint 1.

## Relación con el Product Backlog / Sprint 1

| Historia | Descripción | Componente | Prioridad | Puntos |
|---|---|---|---|---|
| HU-01 | Registro y administración de residentes | `RegistroResidentes` | Alta | 3 |
| HU-02 | Roles y permisos (presidente, tesorera, secretario, residente) | `RolesPermisos` | Alta | 5 |
| HU-03 | Inicio de sesión y recuperación de acceso | `Login` | Alta | 3 |
| HU-04 | Registro de cuotas y adeudos | `Cuotas` | Alta | 5 |
| HU-05 | Consulta de estado de cuenta | `EstadoCuenta` | Alta | 3 |

Cada historia corresponde a un paquete de trabajo de la EDT del proyecto (Proyecto 1, sección 1.4
Desarrollo del sistema — módulos de usuarios/seguridad y financiero) y a una tarjeta del Sprint 1
en el tablero de Trello del proyecto.

## Objetivo del sprint

> "Dejar operativo el registro, la autenticación y los roles de los residentes, junto con el
> registro de cuotas y la consulta de estado de cuenta, de modo que los siguientes sprints puedan
> construirse sobre una base de usuarios y datos financieros ya funcional."

## Cómo funciona

La aplicación es una demo de una sola página (sin backend) pensada para validar el flujo y las
reglas de negocio de cada historia antes de conectarlas a una base de datos real:

- **Registro de residentes**: formulario que valida campos obligatorios y correo duplicado, y
  agrega el residente a la lista con rol por defecto "Residente".
- **Roles y permisos**: tabla editable donde la mesa directiva reasigna el rol de cada residente
  (Presidente, Tesorera, Secretario, Residente).
- **Inicio de sesión**: valida correo/contraseña contra los residentes registrados y simula el
  flujo de recuperación de contraseña por correo.
- **Cuotas y adeudos**: registra cuotas por residente/mes/monto y permite marcarlas como pagadas.
- **Estado de cuenta**: calcula, por residente, el total pagado y el adeudo pendiente a partir de
  sus cuotas.

El estado se mantiene en memoria (`useState`) durante la sesión del navegador; no persiste datos
en disco. En una siguiente iteración este estado se sustituiría por llamadas a la API/base de
datos definida en la materia de Base de Datos.

## Cómo ejecutarlo

Requiere [Node.js](https://nodejs.org/) 18 o superior.

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

Cuenta de prueba para iniciar sesión: `ana.torres@losrobles.mx` / `1234`

## Stack técnico

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) como bundler de desarrollo
- [Tailwind CSS](https://tailwindcss.com/) para estilos
- [lucide-react](https://lucide.dev/) para iconografía

## Autor

Juan Antonio Fuentes Herrera — Licenciatura en Desarrollo de Sistemas Web, UDG Plus.
Proyecto base (EDT / WBS): equipo S.U.D.I. (Proyecto 1) — Jorge Luis Espinosa Acosta, Juan Antonio
Fuentes Herrera, Melissa Suzette Jimenez Alvarado, Jorge Eduardo Ledesma Cruz.
