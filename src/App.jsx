import { useState } from "react";
import {
  Trees,
  UserPlus,
  ShieldCheck,
  LogIn,
  Wallet,
  Receipt,
  LogOut,
  CheckCircle2,
  Circle,
  Lock,
  FileCheck2,
  BellRing,
  BarChart3,
  Megaphone,
  PenSquare,
  AlertTriangle,
  Download,
  Printer,
  Clock,
  PhoneCall,
  ClipboardList,
  Wrench,
  Vote,
} from "lucide-react";

/*
  S.U.D.I. — Sistema Único de Información, Residencial Los Robles
  Sprint 2 · Unidad 3, Actividad 2 (Proyecto 2 — Scrum)

  Sprint 1 (completado):
    HU-01  Registro y administración de residentes   -> RegistroResidentes
    HU-02  Roles y permisos                          -> RolesPermisos + control de acceso
    HU-03  Inicio de sesión y recuperación de acceso  -> Login
    HU-04  Registro de cuotas y adeudos               -> Cuotas
    HU-05  Consulta de estado de cuenta               -> EstadoCuenta

  Sprint 2 (esta versión):
    HU-06  Validación de pagos con comprobante        -> Pagos
    HU-07  Notificaciones automáticas de adeudo       -> Adeudos
    HU-08  Reportes de recaudación                    -> Reportes
    HU-09  Avisos generales                           -> PublicarAvisos + Avisos
    HU-10  Notificaciones urgentes                    -> PublicarAvisos + Avisos

  Sprint 3 (esta versión):
    HU-11  Directorio de emergencia y contacto rápido -> Emergencias
    HU-12  Registro de incidencias                    -> Incidencias
    HU-13  Solicitud de mantenimiento                 -> Mantenimiento
    HU-14  Votaciones y encuestas                     -> Votaciones

  Ajustes de la revisión del Sprint 1 (versión anterior): A5–A9.
  Ajustes del Sprint 2 (esta versión):
    A11  HU-04  Fecha límite de pago obligatoria en cada cuota (pendiente P1).
    A12  HU-06  El comprobante solo acepta imagen o PDF.
    A13  HU-06  Una cuota solo pasa a pagada por validación; se elimina el cambio libre
                pagado/pendiente del Sprint 1 y el pago en ventanilla queda registrado.
    A14  HU-06  Nadie puede validar su propio comprobante (separación de funciones).
    A15  HU-07  Además de los adeudos vencidos, recordatorio a cuotas que vencen en 3 días.
    A16  HU-08  Exportación a CSV e impresión / PDF del reporte.
    A17  HU-10  Historial de avisos y notificaciones urgentes publicados.

  Ajustes del Sprint 3 (esta versión):
    A19  HU-13  Las notificaciones del residente se generalizan: además de adeudos, recibe el aviso
                de mantenimiento concluido (sección “Avisos y notificaciones”).
    A20  HU-14  El conteo se muestra solo al cerrar la votación (por la mesa o por fecha) para no
                influir en el voto; un residente solo vota una vez.
    A21  HU-12/13  Cada cambio de estatus de una incidencia queda en un historial con fecha, y una
                solicitud no puede asignarse sin indicar responsable.
    A22  Sprint 3  Orden del sprint (P3): HU-14 primero y tiempo reservado para pruebas.

  No usa backend: el estado vive en memoria (useState). Al recargar la página los datos
  vuelven a los valores iniciales. En una iteración posterior se conectará a una base de datos.
*/

const ROLES = ["Presidente", "Tesorera", "Secretario", "Residente"];
const MESA_DIRECTIVA = ["Presidente", "Tesorera", "Secretario"];
const TODOS = ["Presidente", "Tesorera", "Secretario", "Residente"];
const PUEDEN_VALIDAR = ["Presidente", "Tesorera"];
const PUEDEN_AVISO_GENERAL = ["Presidente", "Secretario"];
const DIAS_RECORDATORIO = 3;

const initialResidentes = [
  { id: 1, nombre: "Ana Torres", email: "ana.torres@losrobles.mx", telefono: "442-100-0001", vivienda: "A-12", rol: "Presidente", password: "1234" },
  { id: 2, nombre: "Carlos Medina", email: "carlos.medina@losrobles.mx", telefono: "442-100-0002", vivienda: "B-04", rol: "Tesorera", password: "1234" },
  { id: 3, nombre: "Marta Reyes", email: "marta.reyes@losrobles.mx", telefono: "442-100-0003", vivienda: "C-07", rol: "Secretario", password: "1234" },
  { id: 4, nombre: "Jorge Paredes", email: "jorge.paredes@losrobles.mx", telefono: "442-100-0004", vivienda: "A-05", rol: "Residente", password: "1234" },
];

// Una cuota pagada guarda su recibo; una cuota con comprobante guarda el comprobante (HU-06)
const reciboVentanilla = (id, fecha, por) => ({ folio: folioDe(id), fecha, validadoPor: por, via: "Ventanilla" });
const folioDe = (id) => `R-${String(id).padStart(4, "0")}`;

const initialCuotas = [
  { id: 1, residenteId: 4, mes: "Agosto 2026", monto: 850, vence: "2026-08-10", pagado: true, comprobante: null, recibo: reciboVentanilla(1, "2026-08-08", "Carlos Medina") },
  { id: 2, residenteId: 4, mes: "Septiembre 2026", monto: 850, vence: "2026-09-10", pagado: false, comprobante: null, recibo: null },
  { id: 3, residenteId: 2, mes: "Septiembre 2026", monto: 850, vence: "2026-09-10", pagado: true, comprobante: null, recibo: reciboVentanilla(3, "2026-09-09", "Ana Torres") },
  { id: 4, residenteId: 3, mes: "Septiembre 2026", monto: 850, vence: "2026-09-10", pagado: false, comprobante: null, recibo: null },
  { id: 5, residenteId: 4, mes: "Octubre 2026", monto: 850, vence: "2026-10-31", pagado: false, comprobante: null, recibo: null },
];

const initialAvisos = [
  { id: 1, titulo: "Asamblea general de residentes", contenido: "Se convoca a asamblea el sábado 17 de octubre a las 10:00 h en el salón comunal para revisar el presupuesto anual.", urgente: false, autorId: 3, fechaHora: "2026-10-08T09:00:00" },
  { id: 2, titulo: "Mantenimiento de áreas verdes", contenido: "El jardinero atenderá las áreas comunes del lunes al miércoles de la próxima semana.", urgente: false, autorId: 3, fechaHora: "2026-10-12T16:30:00" },
];

const initialContactos = [
  { id: 1, nombre: "Caseta de vigilancia", telefono: "442-100-0911", detalle: "Atención las 24 horas", rapido: true },
  { id: 2, nombre: "Emergencias", telefono: "911", detalle: "Policía, bomberos y ambulancia", rapido: false },
  { id: 3, nombre: "Cruz Roja", telefono: "065", detalle: "Atención médica de urgencia", rapido: false },
  { id: 4, nombre: "Administración del residencial", telefono: "442-100-0100", detalle: "Lunes a viernes, 9:00 a 17:00 h", rapido: false },
];

const initialIncidencias = [
  { id: 1, residenteId: 4, tipo: "Alumbrado", descripcion: "Lámpara fundida en el andador A.", fecha: "2026-10-16", estatus: "En atención",
    historial: [{ estatus: "Pendiente", fecha: "2026-10-16" }, { estatus: "En atención", fecha: "2026-10-18" }] },
];

const initialMantenimientos = [];

const initialVotaciones = [
  { id: 1, pregunta: "¿Aprobamos pintar la fachada del residencial?", opciones: ["Sí", "No"], cierre: "2026-10-30", cerrada: false, votos: { 3: 0 } },
  { id: 2, pregunta: "¿Qué horario prefieren para el salón comunal?", opciones: ["8:00 a 20:00 h", "9:00 a 22:00 h"], cierre: "2026-10-15", cerrada: false, votos: { 1: 1, 2: 1, 3: 0, 4: 1 } },
];

const TABS = [
  { id: "registro", label: "Registro de residentes", hu: "HU-01", sprint: 1, icon: UserPlus },
  { id: "roles", label: "Roles y permisos", hu: "HU-02", sprint: 1, icon: ShieldCheck },
  { id: "login", label: "Inicio de sesión", hu: "HU-03", sprint: 1, icon: LogIn },
  { id: "cuotas", label: "Cuotas y adeudos", hu: "HU-04", sprint: 1, icon: Wallet },
  { id: "estado", label: "Estado de cuenta", hu: "HU-05", sprint: 1, icon: Receipt },
  { id: "pagos", label: "Pagos y comprobantes", hu: "HU-06", sprint: 2, icon: FileCheck2 },
  { id: "adeudos", label: "Adeudos y notificaciones", hu: "HU-07", sprint: 2, icon: BellRing },
  { id: "reportes", label: "Reportes de recaudación", hu: "HU-08", sprint: 2, icon: BarChart3 },
  { id: "avisos", label: "Avisos y notificaciones", hu: "HU-09 · HU-10", sprint: 2, icon: Megaphone },
  { id: "publicar", label: "Publicar avisos", hu: "HU-09 · HU-10", sprint: 2, icon: PenSquare },
  { id: "emergencias", label: "Directorio de emergencia", hu: "HU-11", sprint: 3, icon: PhoneCall },
  { id: "incidencias", label: "Registro de incidencias", hu: "HU-12", sprint: 3, icon: ClipboardList },
  { id: "mantenimiento", label: "Solicitudes de mantenimiento", hu: "HU-13", sprint: 3, icon: Wrench },
  { id: "votaciones", label: "Votaciones y encuestas", hu: "HU-14", sprint: 3, icon: Vote },
];

// Roles con acceso a cada sección (null = pública, sin necesidad de sesión)
const ACCESS = {
  registro: null,
  login: null,
  roles: ["Presidente"],
  cuotas: ["Presidente", "Tesorera"],
  estado: TODOS,
  pagos: TODOS,
  adeudos: ["Presidente", "Tesorera"],
  reportes: MESA_DIRECTIVA,
  avisos: TODOS,
  publicar: MESA_DIRECTIVA,
  emergencias: TODOS,
  incidencias: TODOS,
  mantenimiento: TODOS,
  votaciones: TODOS,
};

function canAccess(tabId, user) {
  const allowed = ACCESS[tabId];
  if (allowed === null) return true;
  return !!user && allowed.includes(user.rol);
}

const normalizeEmail = (value) => value.trim().toLowerCase();

// ---------- Utilidades de fechas, dinero y estatus (Sprint 2) ----------
const hoyLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function sumarDias(iso, n) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const fmtFecha = (iso) => (iso ? new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "—");
const fmtFechaHora = (iso) =>
  new Date(iso).toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const ahoraISO = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};
const money = (n) => `$${n.toLocaleString("es-MX")}`;

// Pagada | En validación | Vencida | Pendiente  (HU-06 / HU-07)
function estatusCuota(c, hoy) {
  if (c.pagado) return "Pagada";
  if (c.comprobante?.estado === "En validación") return "En validación";
  return c.vence < hoy ? "Vencida" : "Pendiente";
}

const ESTATUS_CLASE = {
  Pagada: "text-emerald-800 bg-emerald-50 border-emerald-200",
  "En validación": "text-sky-800 bg-sky-50 border-sky-200",
  Vencida: "text-red-800 bg-red-50 border-red-200",
  Pendiente: "text-amber-800 bg-amber-50 border-amber-200",
};

function EstatusBadge({ estatus }) {
  return <span className={`inline-block text-xs px-2 py-0.5 rounded border ${ESTATUS_CLASE[estatus]}`}>{estatus}</span>;
}

function HuBadge({ children }) {
  return (
    <span className="inline-block text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
      {children}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-stone-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full border border-stone-300 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700";

function AccesoRestringido({ tab, user }) {
  const allowed = ACCESS[tab.id];
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-serif text-emerald-900">{tab.label}</h2>
        <HuBadge>{tab.hu} · Sprint {tab.sprint}</HuBadge>
      </div>
      <div className="max-w-md bg-white border border-stone-200 rounded p-5 mt-6">
        <div className="flex items-center gap-2 text-amber-800 mb-2">
          <Lock size={18} />
          <p className="font-medium">Acceso restringido</p>
        </div>
        <p className="text-sm text-stone-600">
          {user
            ? `Tu rol actual (${user.rol}) no tiene permiso para esta sección. Roles con acceso: ${allowed.join(", ")}.`
            : `Inicia sesión para entrar a esta sección. Roles con acceso: ${allowed.join(", ")}.`}
        </p>
      </div>
    </div>
  );
}

function RegistroResidentes({ residentes, onRegistrar }) {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", vivienda: "", password: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const email = normalizeEmail(form.email);
    if (!form.nombre.trim() || !email || !form.vivienda.trim() || !form.password) {
      setError("Completa nombre, correo, vivienda y contraseña.");
      setOk("");
      return;
    }
    if (form.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      setOk("");
      return;
    }
    if (residentes.some((r) => normalizeEmail(r.email) === email)) {
      setError("Ya existe un residente registrado con ese correo.");
      setOk("");
      return;
    }
    onRegistrar({ ...form, email });
    setForm({ nombre: "", email: "", telefono: "", vivienda: "", password: "" });
    setError("");
    setOk(`Residente "${form.nombre}" registrado correctamente. Ya puede iniciar sesión.`);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-serif text-emerald-900">Registro de residentes</h2>
        <HuBadge>HU-01 · Sprint 1</HuBadge>
      </div>
      <p className="text-sm text-stone-600 mb-6">
        Como residente del conjunto Los Robles, quiero registrarme en la plataforma con mis datos
        personales, para poder acceder de forma segura a los servicios digitales del residencial.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md bg-white border border-stone-200 rounded p-5 mb-8">
        <Field label="Nombre completo">
          <input className={inputClass} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre y apellidos" />
        </Field>
        <Field label="Correo electrónico">
          <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nombre@correo.com" />
        </Field>
        <Field label="Teléfono">
          <input className={inputClass} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="442-000-0000" />
        </Field>
        <Field label="Número de vivienda">
          <input className={inputClass} value={form.vivienda} onChange={(e) => setForm({ ...form, vivienda: e.target.value })} placeholder="Ej. A-12" />
        </Field>
        <Field label="Contraseña">
          <input type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 4 caracteres" />
        </Field>

        {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
        {ok && <p className="text-sm text-emerald-700 mb-3">{ok}</p>}

        <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">
          Registrar residente
        </button>
      </form>

      <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-2">Residentes registrados ({residentes.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className="py-2 pr-4">Nombre</th>
              <th className="py-2 pr-4">Correo</th>
              <th className="py-2 pr-4">Vivienda</th>
              <th className="py-2 pr-4">Rol</th>
            </tr>
          </thead>
          <tbody>
            {residentes.map((r) => (
              <tr key={r.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-800">{r.nombre}</td>
                <td className="py-2 pr-4 text-stone-600">{r.email}</td>
                <td className="py-2 pr-4 text-stone-600">{r.vivienda}</td>
                <td className="py-2 pr-4 text-stone-600">{r.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MatrizPermisos() {
  const puede = (tabId, rol) => {
    const allowed = ACCESS[tabId];
    return allowed === null || allowed.includes(rol);
  };
  return (
    <div className="mb-8 overflow-x-auto">
      <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-2">Matriz de permisos por rol</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-stone-500 border-b border-stone-300">
            <th className="py-2 pr-4">Sección</th>
            {ROLES.map((rol) => (
              <th key={rol} className="py-2 pr-4 text-center">{rol}</th>
            ))}
            <th className="py-2 text-center">Sin sesión</th>
          </tr>
        </thead>
        <tbody>
          {TABS.map((t) => (
            <tr key={t.id} className="border-b border-stone-100">
              <td className="py-2 pr-4 text-stone-800">{t.label}</td>
              {ROLES.map((rol) => (
                <td key={rol} className="py-2 pr-4 text-center text-stone-600">{puede(t.id, rol) ? "✓" : "—"}</td>
              ))}
              <td className="py-2 text-center text-stone-600">{ACCESS[t.id] === null ? "✓" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RolesPermisos({ residentes, onCambiarRol }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-serif text-emerald-900">Roles y permisos</h2>
        <HuBadge>HU-02 · Sprint 1</HuBadge>
      </div>
      <p className="text-sm text-stone-600 mb-6">
        Como administrador (mesa directiva), quiero asignar roles diferenciados, para que cada
        usuario acceda solo a las funciones que le corresponden.
      </p>

      <MatrizPermisos />

      <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-2">Asignación de roles</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className="py-2 pr-4">Residente</th>
              <th className="py-2 pr-4">Vivienda</th>
              <th className="py-2 pr-4">Rol asignado</th>
            </tr>
          </thead>
          <tbody>
            {residentes.map((r) => (
              <tr key={r.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-800">{r.nombre}</td>
                <td className="py-2 pr-4 text-stone-600">{r.vivienda}</td>
                <td className="py-2 pr-4">
                  <select
                    aria-label={`Rol de ${r.nombre}`}
                    className="border border-stone-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    value={r.rol}
                    onChange={(e) => onCambiarRol(r.id, e.target.value)}
                  >
                    {ROLES.map((rol) => (
                      <option key={rol} value={rol}>{rol}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Login({ residentes, currentUser, onLogin, onLogout }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMsg, setRecoveryMsg] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const found = residentes.find((r) => normalizeEmail(r.email) === normalizeEmail(email) && r.password === password);
    if (!found) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    setError("");
    setEmail("");
    setPassword("");
    onLogin(found);
  }

  function handleRecovery(e) {
    e.preventDefault();
    const found = residentes.find((r) => normalizeEmail(r.email) === normalizeEmail(recoveryEmail));
    setRecoveryMsg(
      found
        ? `Se envió un enlace de recuperación a ${recoveryEmail.trim()} (simulado en esta demo).`
        : "No encontramos ninguna cuenta con ese correo."
    );
  }

  const seccionesDisponibles = currentUser
    ? TABS.filter((t) => canAccess(t.id, currentUser)).map((t) => t.label)
    : [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-serif text-emerald-900">Inicio de sesión</h2>
        <HuBadge>HU-03 · Sprint 1</HuBadge>
      </div>
      <p className="text-sm text-stone-600 mb-6">
        Como usuario registrado, quiero iniciar sesión y recuperar mi contraseña, para acceder a
        mi cuenta de manera segura en cualquier momento.
      </p>

      {currentUser ? (
        <div className="max-w-md bg-white border border-stone-200 rounded p-5">
          <p className="text-sm text-stone-600 mb-1">Sesión iniciada como</p>
          <p className="text-lg text-emerald-900 font-medium mb-3">{currentUser.nombre} · {currentUser.rol}</p>
          <p className="text-xs text-stone-500 mb-1">Secciones disponibles para tu rol:</p>
          <p className="text-sm text-stone-700 mb-4">{seccionesDisponibles.join(" · ")}</p>
          <button onClick={onLogout} className="flex items-center gap-2 text-sm text-stone-700 border border-stone-300 rounded px-4 py-2 hover:bg-stone-100">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="max-w-md bg-white border border-stone-200 rounded p-5">
          <form onSubmit={handleSubmit}>
            <Field label="Correo electrónico">
              <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correo.com" />
            </Field>
            <Field label="Contraseña">
              <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
            </Field>
            {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
            <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded mb-3">
              Iniciar sesión
            </button>
          </form>

          <div className="text-xs text-stone-500 mb-3 border-t border-stone-100 pt-3">
            <p className="mb-1">Cuentas de prueba (contraseña 1234):</p>
            <ul className="space-y-0.5">
              <li>Presidente: ana.torres@losrobles.mx</li>
              <li>Tesorera: carlos.medina@losrobles.mx</li>
              <li>Secretario: marta.reyes@losrobles.mx</li>
              <li>Residente: jorge.paredes@losrobles.mx</li>
            </ul>
          </div>

          <button onClick={() => setShowRecovery((v) => !v)} className="text-sm text-emerald-700 underline">
            ¿Olvidaste tu contraseña?
          </button>

          {showRecovery && (
            <form onSubmit={handleRecovery} className="mt-4 border-t border-stone-200 pt-4">
              <Field label="Correo para recuperación">
                <input type="email" className={inputClass} value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="nombre@correo.com" />
              </Field>
              <button type="submit" className="text-sm border border-stone-300 rounded px-4 py-2 hover:bg-stone-100">
                Enviar enlace de recuperación
              </button>
              {recoveryMsg && <p className="text-sm text-stone-600 mt-2">{recoveryMsg}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function Cuotas({ residentes, cuotas, hoy, onAgregarCuota, onPagoVentanilla }) {
  const [residenteId, setResidenteId] = useState(residentes[0]?.id ?? "");
  const [mes, setMes] = useState("");
  const [monto, setMonto] = useState("850");
  const [vence, setVence] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!residenteId || !mes.trim() || !monto || !vence) {
      setError("Completa residente, mes, monto y fecha límite de pago.");
      return;
    }
    onAgregarCuota(Number(residenteId), mes.trim(), Number(monto), vence);
    setMes("");
    setVence("");
    setError("");
  }

  function nombreResidente(id) {
    return residentes.find((r) => r.id === id)?.nombre ?? "—";
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-serif text-emerald-900">Cuotas y adeudos</h2>
        <HuBadge>HU-04 · Sprint 1</HuBadge>
      </div>
      <p className="text-sm text-stone-600 mb-6">
        Como tesorera, quiero registrar las cuotas y adeudos de cada residente, para mantener
        actualizado el control financiero del residencial. Cada cuota lleva una fecha límite de
        pago (ajuste A11); el pago de una cuota se confirma en “Pagos y comprobantes” o, si se
        paga en ventanilla, con el botón de esta tabla (ajuste A13).
      </p>

      <form onSubmit={handleSubmit} className="max-w-md bg-white border border-stone-200 rounded p-5 mb-8">
        <Field label="Residente">
          <select className={inputClass} value={residenteId} onChange={(e) => setResidenteId(e.target.value)}>
            {residentes.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre} · {r.vivienda}</option>
            ))}
          </select>
        </Field>
        <Field label="Mes a cobrar">
          <input className={inputClass} value={mes} onChange={(e) => setMes(e.target.value)} placeholder="Ej. Octubre 2026" />
        </Field>
        <Field label="Monto (MXN)">
          <input type="number" className={inputClass} value={monto} onChange={(e) => setMonto(e.target.value)} />
        </Field>
        <Field label="Fecha límite de pago">
          <input type="date" className={inputClass} value={vence} onChange={(e) => setVence(e.target.value)} />
        </Field>
        {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
        <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">
          Registrar cuota
        </button>
      </form>

      <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-2">Cuotas registradas</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className="py-2 pr-4">Residente</th>
              <th className="py-2 pr-4">Mes</th>
              <th className="py-2 pr-4">Monto</th>
              <th className="py-2 pr-4">Fecha límite</th>
              <th className="py-2 pr-4">Estatus</th>
              <th className="py-2 pr-4">Pago en ventanilla</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((c) => {
              const estatus = estatusCuota(c, hoy);
              return (
                <tr key={c.id} className="border-b border-stone-100">
                  <td className="py-2 pr-4 text-stone-800">{nombreResidente(c.residenteId)}</td>
                  <td className="py-2 pr-4 text-stone-600">{c.mes}</td>
                  <td className="py-2 pr-4 text-stone-600">{money(c.monto)}</td>
                  <td className="py-2 pr-4 text-stone-600">{fmtFecha(c.vence)}</td>
                  <td className="py-2 pr-4"><EstatusBadge estatus={estatus} /></td>
                  <td className="py-2 pr-4">
                    {c.pagado ? (
                      <span className="text-xs text-stone-500">Recibo {c.recibo?.folio}</span>
                    ) : (
                      <button
                        onClick={() => onPagoVentanilla(c.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-stone-300 text-stone-700 hover:bg-stone-100"
                      >
                        <Circle size={14} /> Registrar pago
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EstadoCuenta({ residentes, cuotas, currentUser, hoy }) {
  // Mesa directiva puede consultar a cualquier residente; un residente solo su propia cuenta (A9)
  const esMesa = MESA_DIRECTIVA.includes(currentUser.rol);
  const [seleccion, setSeleccion] = useState(currentUser.id);
  const idActivo = esMesa ? Number(seleccion) : currentUser.id;

  const residente = residentes.find((r) => r.id === idActivo);
  const cuotasResidente = cuotas.filter((c) => c.residenteId === idActivo);
  const totalPagado = cuotasResidente.filter((c) => c.pagado).reduce((s, c) => s + c.monto, 0);
  const totalAdeudo = cuotasResidente.filter((c) => !c.pagado).reduce((s, c) => s + c.monto, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-serif text-emerald-900">Estado de cuenta</h2>
        <HuBadge>HU-05 · Sprint 1</HuBadge>
      </div>
      <p className="text-sm text-stone-600 mb-6">
        Como residente, quiero consultar mi estado de cuenta, para conocer de forma clara mis
        pagos realizados y mis adeudos pendientes.
      </p>

      <div className="max-w-md mb-6">
        {esMesa ? (
          <Field label="Selecciona un residente">
            <select className={inputClass} value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
              {residentes.map((r) => (
                <option key={r.id} value={r.id}>{r.nombre} · {r.vivienda}</option>
              ))}
            </select>
          </Field>
        ) : (
          <p className="text-sm text-stone-600">
            Cuenta de <span className="font-medium text-stone-800">{residente?.nombre}</span> · vivienda {residente?.vivienda}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mb-8">
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total pagado</p>
          <p className="text-2xl font-serif text-emerald-800">{money(totalPagado)}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Adeudo pendiente</p>
          <p className="text-2xl font-serif text-amber-700">{money(totalAdeudo)}</p>
        </div>
      </div>

      <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-2">
        Historial de {residente?.nombre ?? "—"}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className="py-2 pr-4">Mes</th>
              <th className="py-2 pr-4">Monto</th>
              <th className="py-2 pr-4">Fecha límite</th>
              <th className="py-2 pr-4">Estatus</th>
              <th className="py-2 pr-4">Recibo</th>
            </tr>
          </thead>
          <tbody>
            {cuotasResidente.length === 0 && (
              <tr><td colSpan={5} className="py-3 text-stone-500">Sin movimientos registrados.</td></tr>
            )}
            {cuotasResidente.map((c) => (
              <tr key={c.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-800">{c.mes}</td>
                <td className="py-2 pr-4 text-stone-600">{money(c.monto)}</td>
                <td className="py-2 pr-4 text-stone-600">{fmtFecha(c.vence)}</td>
                <td className="py-2 pr-4"><EstatusBadge estatus={estatusCuota(c, hoy)} /></td>
                <td className="py-2 pr-4 text-stone-600">{c.recibo?.folio ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =====================================================================
// SPRINT 2
// =====================================================================

function EncabezadoHU({ tabId, titulo, historia }) {
  const tab = TABS.find((t) => t.id === tabId);
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-serif text-emerald-900">{titulo}</h2>
        <HuBadge>{tab.hu} · Sprint {tab.sprint}</HuBadge>
      </div>
      <p className="text-sm text-stone-600 mb-6">{historia}</p>
    </>
  );
}

const subtitulo = "text-sm font-medium text-stone-500 uppercase tracking-wide mb-2";
const thClass = "py-2 pr-4";

// ---------- HU-06 · Validación de pagos ----------
function Pagos({ residentes, cuotas, hoy, currentUser, onEnviarComprobante, onValidar, onRechazar }) {
  const puedeValidar = PUEDEN_VALIDAR.includes(currentUser.rol);
  const mias = cuotas.filter((c) => c.residenteId === currentUser.id);
  const pagables = mias.filter((c) => !c.pagado && c.comprobante?.estado !== "En validación");
  const porValidar = cuotas.filter((c) => c.comprobante?.estado === "En validación");

  const [cuotaId, setCuotaId] = useState("");
  const [metodo, setMetodo] = useState("Transferencia");
  const [referencia, setReferencia] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [inputKey, setInputKey] = useState(0);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [motivos, setMotivos] = useState({});
  const [msgValidacion, setMsgValidacion] = useState({ tipo: "", texto: "" });

  const idSel = pagables.some((c) => c.id === Number(cuotaId)) ? Number(cuotaId) : pagables[0]?.id ?? "";
  const nombre = (id) => residentes.find((r) => r.id === id)?.nombre ?? "—";

  function handleSubmit(e) {
    e.preventDefault();
    setOk("");
    if (!idSel) {
      setError("No tienes cuotas por pagar.");
      return;
    }
    if (!archivo) {
      setError("Adjunta el comprobante de pago.");
      return;
    }
    // A12: solo imagen o PDF
    if (!(archivo.type.startsWith("image/") || archivo.type === "application/pdf")) {
      setError("El comprobante debe ser una imagen o un PDF.");
      return;
    }
    const cuota = cuotas.find((c) => c.id === idSel);
    onEnviarComprobante(idSel, { archivo: archivo.name, tipo: archivo.type, tam: archivo.size, metodo, referencia: referencia.trim() });
    setError("");
    setOk(`Comprobante de ${cuota.mes} enviado. La cuota queda “En validación” hasta que la tesorería lo revise.`);
    setArchivo(null);
    setReferencia("");
    setInputKey((k) => k + 1);
  }

  function validar(c) {
    onValidar(c.id);
    setMsgValidacion({ tipo: "ok", texto: `Pago validado: ${nombre(c.residenteId)} · ${c.mes}. Se emitió el recibo ${folioDe(c.id)}.` });
  }

  function rechazar(c) {
    const motivo = (motivos[c.id] ?? "").trim();
    if (!motivo) {
      setMsgValidacion({ tipo: "error", texto: "Escribe el motivo del rechazo." });
      return;
    }
    onRechazar(c.id, motivo);
    setMsgValidacion({ tipo: "ok", texto: `Comprobante rechazado: ${nombre(c.residenteId)} · ${c.mes}. El residente podrá enviar uno nuevo.` });
  }

  return (
    <div>
      <EncabezadoHU
        tabId="pagos"
        titulo="Pagos y comprobantes"
        historia="Como residente, quiero registrar y validar mis pagos dentro de la plataforma, para obtener comprobante inmediato de mis aportaciones."
      />

      <form onSubmit={handleSubmit} className="max-w-md bg-white border border-stone-200 rounded p-5 mb-8">
        <h3 className="text-sm font-medium text-stone-700 mb-3">Registrar un pago</h3>
        {pagables.length === 0 ? (
          <p className="text-sm text-stone-600">No tienes cuotas por pagar. ¡Estás al corriente!</p>
        ) : (
          <>
            <Field label="Cuota a pagar">
              <select className={inputClass} value={idSel} onChange={(e) => setCuotaId(e.target.value)} aria-label="Cuota a pagar">
                {pagables.map((c) => (
                  <option key={c.id} value={c.id}>{c.mes} · {money(c.monto)} · {estatusCuota(c, hoy)}</option>
                ))}
              </select>
            </Field>
            <Field label="Método de pago">
              <select className={inputClass} value={metodo} onChange={(e) => setMetodo(e.target.value)} aria-label="Método de pago">
                <option>Transferencia</option>
                <option>Depósito bancario</option>
              </select>
            </Field>
            <Field label="Referencia o folio (opcional)">
              <input className={inputClass} value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Ej. 0048213" />
            </Field>
            <Field label="Comprobante (imagen o PDF)">
              <input
                key={inputKey}
                type="file"
                accept="image/*,application/pdf"
                aria-label="Comprobante de pago"
                className="block w-full text-sm text-stone-600"
                onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              />
            </Field>
            {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
            {ok && (
              <p className="flex items-start gap-2 text-sm text-emerald-700 mb-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> {ok}
              </p>
            )}
            <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">
              Enviar comprobante
            </button>
          </>
        )}
        {pagables.length === 0 && ok && (
          <p className="flex items-start gap-2 text-sm text-emerald-700 mt-3">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> {ok}
          </p>
        )}
      </form>

      <h3 className={subtitulo}>Mis cuotas y comprobantes</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className={thClass}>Mes</th>
              <th className={thClass}>Monto</th>
              <th className={thClass}>Estatus</th>
              <th className={thClass}>Comprobante</th>
              <th className={thClass}>Recibo</th>
            </tr>
          </thead>
          <tbody>
            {mias.length === 0 && (
              <tr><td colSpan={5} className="py-3 text-stone-500">Sin cuotas registradas.</td></tr>
            )}
            {mias.map((c) => (
              <tr key={c.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-800">{c.mes}</td>
                <td className="py-2 pr-4 text-stone-600">{money(c.monto)}</td>
                <td className="py-2 pr-4"><EstatusBadge estatus={estatusCuota(c, hoy)} /></td>
                <td className="py-2 pr-4 text-stone-600">
                  {c.comprobante ? (
                    <>
                      {c.comprobante.archivo} · {c.comprobante.estado}
                      {c.comprobante.estado === "Rechazado" && <span className="block text-xs text-red-700">Motivo: {c.comprobante.motivo}</span>}
                    </>
                  ) : "—"}
                </td>
                <td className="py-2 pr-4 text-stone-600">
                  {c.recibo ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800"><CheckCircle2 size={14} /> {c.recibo.folio}</span>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {puedeValidar && (
        <section>
          <h3 className={subtitulo}>Comprobantes por validar ({porValidar.length})</h3>
          {msgValidacion.texto && (
            <p className={`text-sm mb-3 ${msgValidacion.tipo === "ok" ? "text-emerald-700" : "text-red-700"}`}>{msgValidacion.texto}</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-300">
                  <th className={thClass}>Residente</th>
                  <th className={thClass}>Mes</th>
                  <th className={thClass}>Monto</th>
                  <th className={thClass}>Comprobante</th>
                  <th className={thClass}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {porValidar.length === 0 && (
                  <tr><td colSpan={5} className="py-3 text-stone-500">No hay comprobantes pendientes.</td></tr>
                )}
                {porValidar.map((c) => {
                  const propio = c.residenteId === currentUser.id;
                  return (
                    <tr key={c.id} className="border-b border-stone-100 align-top">
                      <td className="py-2 pr-4 text-stone-800">{nombre(c.residenteId)}</td>
                      <td className="py-2 pr-4 text-stone-600">{c.mes}</td>
                      <td className="py-2 pr-4 text-stone-600">{money(c.monto)}</td>
                      <td className="py-2 pr-4 text-stone-600">
                        {c.comprobante.archivo}
                        <span className="block text-xs text-stone-500">
                          {c.comprobante.metodo}{c.comprobante.referencia ? ` · ref. ${c.comprobante.referencia}` : ""}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {propio ? (
                          <span className="text-xs text-amber-800">No puedes validar tu propio pago; lo revisa otro miembro.</span>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => validar(c)}
                              aria-label={`Validar pago de ${nombre(c.residenteId)} ${c.mes}`}
                              className="self-start text-xs px-2 py-1 rounded bg-emerald-800 text-white hover:bg-emerald-900"
                            >
                              Validar pago
                            </button>
                            <div className="flex gap-1">
                              <input
                                className="border border-stone-300 rounded px-2 py-1 text-xs w-36"
                                placeholder="Motivo de rechazo"
                                aria-label={`Motivo de rechazo ${nombre(c.residenteId)} ${c.mes}`}
                                value={motivos[c.id] ?? ""}
                                onChange={(e) => setMotivos({ ...motivos, [c.id]: e.target.value })}
                              />
                              <button
                                onClick={() => rechazar(c)}
                                aria-label={`Rechazar pago de ${nombre(c.residenteId)} ${c.mes}`}
                                className="text-xs px-2 py-1 rounded border border-red-300 text-red-800 hover:bg-red-50"
                              >
                                Rechazar
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

// ---------- HU-07 · Notificaciones de adeudo ----------
function Adeudos({ residentes, cuotas, notificaciones: todasNotif, hoy, onGenerar }) {
  const notificaciones = todasNotif.filter((n) => n.tipo === "Vencida" || n.tipo === "Recordatorio");
  const [msg, setMsg] = useState("");
  const limite = sumarDias(hoy, DIAS_RECORDATORIO);
  const vencidas = cuotas.filter((c) => estatusCuota(c, hoy) === "Vencida");
  const porVencer = cuotas.filter((c) => estatusCuota(c, hoy) === "Pendiente" && c.vence <= limite);

  const morosos = residentes
    .map((r) => {
      const cs = vencidas.filter((c) => c.residenteId === r.id);
      return { residente: r, cuotas: cs, total: cs.reduce((s, c) => s + c.monto, 0) };
    })
    .filter((m) => m.cuotas.length > 0);
  const totalVencido = morosos.reduce((s, m) => s + m.total, 0);
  const notificadoHoy = (residenteId) => notificaciones.some((n) => n.residenteId === residenteId && n.fecha === hoy && n.tipo === "Vencida");
  const nombre = (id) => residentes.find((r) => r.id === id)?.nombre ?? "—";

  function generar() {
    const n = onGenerar();
    setMsg(
      n > 0
        ? `Se generaron ${n} ${n === 1 ? "notificación" : "notificaciones"} de adeudo.`
        : "No hay cuotas vencidas ni próximas a vencer sin notificar hoy."
    );
  }

  return (
    <div>
      <EncabezadoHU
        tabId="adeudos"
        titulo="Adeudos y notificaciones"
        historia="Como tesorera, quiero que el sistema genere notificaciones automáticas de adeudo, para recordar a los residentes morosos sus pagos pendientes."
      />

      <div className="grid grid-cols-3 gap-4 max-w-2xl mb-6">
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Residentes morosos</p>
          <p className="text-2xl font-serif text-red-700">{morosos.length}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Adeudo vencido</p>
          <p className="text-2xl font-serif text-red-700">{money(totalVencido)}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Vencen en {DIAS_RECORDATORIO} días</p>
          <p className="text-2xl font-serif text-amber-700">{porVencer.length}</p>
        </div>
      </div>

      <div className="mb-8">
        <button onClick={generar} className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">
          Generar notificaciones de adeudo
        </button>
        {msg && <p className="text-sm text-emerald-700 mt-2">{msg}</p>}
        <p className="text-xs text-stone-500 mt-2">
          Cuotas vencidas (fecha límite anterior a hoy) generan un aviso de adeudo; las que vencen en los próximos {DIAS_RECORDATORIO} días
          generan un recordatorio (ajuste A15). Una cuota no se notifica dos veces el mismo día.
        </p>
      </div>

      <h3 className={subtitulo}>Residentes con adeudo vencido</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className={thClass}>Residente</th>
              <th className={thClass}>Vivienda</th>
              <th className={thClass}>Cuotas vencidas</th>
              <th className={thClass}>Adeudo</th>
              <th className={thClass}>Notificado hoy</th>
            </tr>
          </thead>
          <tbody>
            {morosos.length === 0 && (
              <tr><td colSpan={5} className="py-3 text-stone-500">No hay residentes con adeudo vencido.</td></tr>
            )}
            {morosos.map((m) => (
              <tr key={m.residente.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-800">{m.residente.nombre}</td>
                <td className="py-2 pr-4 text-stone-600">{m.residente.vivienda}</td>
                <td className="py-2 pr-4 text-stone-600">{m.cuotas.map((c) => c.mes).join(", ")}</td>
                <td className="py-2 pr-4 text-stone-600">{money(m.total)}</td>
                <td className="py-2 pr-4 text-stone-600">{notificadoHoy(m.residente.id) ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className={subtitulo}>Notificaciones generadas ({notificaciones.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className={thClass}>Fecha</th>
              <th className={thClass}>Residente</th>
              <th className={thClass}>Tipo</th>
              <th className={thClass}>Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {notificaciones.length === 0 && (
              <tr><td colSpan={4} className="py-3 text-stone-500">Aún no se generan notificaciones.</td></tr>
            )}
            {notificaciones.map((n) => (
              <tr key={n.id} className="border-b border-stone-100 align-top">
                <td className="py-2 pr-4 text-stone-600">{fmtFecha(n.fecha)}</td>
                <td className="py-2 pr-4 text-stone-800">{nombre(n.residenteId)}</td>
                <td className="py-2 pr-4 text-stone-600">{n.tipo}</td>
                <td className="py-2 pr-4 text-stone-600">{n.mensaje}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- HU-08 · Reportes de recaudación ----------
function descargarCSV(nombreArchivo, texto) {
  try {
    const blob = new Blob(["﻿" + texto], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    /* entornos sin soporte de descarga */
  }
}

function Reportes({ residentes, cuotas, hoy }) {
  const periodos = [...new Set(cuotas.map((c) => c.mes))];
  const [periodo, setPeriodo] = useState("Todos");
  const filas = cuotas.filter((c) => periodo === "Todos" || c.mes === periodo);

  const esperado = filas.reduce((s, c) => s + c.monto, 0);
  const recaudado = filas.filter((c) => c.pagado).reduce((s, c) => s + c.monto, 0);
  const pendiente = esperado - recaudado;
  const porcentaje = esperado ? Math.round((recaudado / esperado) * 100) : 0;

  const desglose = residentes
    .map((r) => {
      const cs = filas.filter((c) => c.residenteId === r.id);
      const esp = cs.reduce((s, c) => s + c.monto, 0);
      const rec = cs.filter((c) => c.pagado).reduce((s, c) => s + c.monto, 0);
      return { residente: r, cuotas: cs.length, esperado: esp, recaudado: rec, pendiente: esp - rec };
    })
    .filter((d) => d.cuotas > 0)
    .sort((a, b) => a.residente.vivienda.localeCompare(b.residente.vivienda));

  function exportarCSV() {
    const lineas = ["Vivienda,Residente,Cuotas,Esperado,Recaudado,Pendiente"];
    desglose.forEach((d) =>
      lineas.push([d.residente.vivienda, `"${d.residente.nombre}"`, d.cuotas, d.esperado, d.recaudado, d.pendiente].join(","))
    );
    lineas.push(["TOTAL", "", filas.length, esperado, recaudado, pendiente].join(","));
    descargarCSV(`reporte-recaudacion-${periodo.replace(/\s+/g, "-").toLowerCase()}.csv`, lineas.join("\n"));
  }

  return (
    <div>
      <EncabezadoHU
        tabId="reportes"
        titulo="Reportes de recaudación"
        historia="Como mesa directiva, quiero generar reportes de recaudación e historial de pagos, para tomar decisiones financieras informadas."
      />

      <div className="flex flex-wrap items-end gap-3 mb-6 print:hidden">
        <div className="w-56">
          <Field label="Periodo">
            <select className={inputClass} value={periodo} onChange={(e) => setPeriodo(e.target.value)} aria-label="Periodo del reporte">
              <option value="Todos">Todos los periodos</option>
              {periodos.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>
        <button onClick={exportarCSV} className="flex items-center gap-2 text-sm border border-stone-300 rounded px-4 py-2 mb-3 hover:bg-stone-100">
          <Download size={16} /> Exportar CSV
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 text-sm border border-stone-300 rounded px-4 py-2 mb-3 hover:bg-stone-100">
          <Printer size={16} /> Imprimir / guardar PDF
        </button>
      </div>

      <p className="text-sm text-stone-600 mb-4">
        Reporte de recaudación · Periodo: <span className="font-medium text-stone-800">{periodo === "Todos" ? "Todos los periodos" : periodo}</span> · Emitido el {fmtFecha(hoy)}
      </p>

      <div className="grid grid-cols-4 gap-4 max-w-2xl mb-8">
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Esperado</p>
          <p className="text-xl font-serif text-stone-800" data-testid="rep-esperado">{money(esperado)}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Recaudado</p>
          <p className="text-xl font-serif text-emerald-800" data-testid="rep-recaudado">{money(recaudado)}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Pendiente</p>
          <p className="text-xl font-serif text-amber-700" data-testid="rep-pendiente">{money(pendiente)}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Recaudación</p>
          <p className="text-xl font-serif text-stone-800" data-testid="rep-porcentaje">{porcentaje} %</p>
        </div>
      </div>

      <h3 className={subtitulo}>Desglose por vivienda</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className={thClass}>Vivienda</th>
              <th className={thClass}>Residente</th>
              <th className={thClass}>Cuotas</th>
              <th className={thClass}>Esperado</th>
              <th className={thClass}>Recaudado</th>
              <th className={thClass}>Pendiente</th>
            </tr>
          </thead>
          <tbody>
            {desglose.length === 0 && (
              <tr><td colSpan={6} className="py-3 text-stone-500">Sin cuotas en este periodo.</td></tr>
            )}
            {desglose.map((d) => (
              <tr key={d.residente.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-800">{d.residente.vivienda}</td>
                <td className="py-2 pr-4 text-stone-600">{d.residente.nombre}</td>
                <td className="py-2 pr-4 text-stone-600">{d.cuotas}</td>
                <td className="py-2 pr-4 text-stone-600">{money(d.esperado)}</td>
                <td className="py-2 pr-4 text-stone-600">{money(d.recaudado)}</td>
                <td className="py-2 pr-4 text-stone-600">{money(d.pendiente)}</td>
              </tr>
            ))}
            {desglose.length > 0 && (
              <tr className="font-medium text-stone-800">
                <td className="py-2 pr-4" colSpan={2}>Total</td>
                <td className="py-2 pr-4">{filas.length}</td>
                <td className="py-2 pr-4">{money(esperado)}</td>
                <td className="py-2 pr-4">{money(recaudado)}</td>
                <td className="py-2 pr-4">{money(pendiente)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- HU-09 / HU-10 · Avisos generales y notificaciones urgentes ----------
const ETIQUETA_NOTIF = { Vencida: "Adeudo vencido", Recordatorio: "Recordatorio", Mantenimiento: "Mantenimiento concluido" };

function TarjetaAviso({ aviso, autor }) {
  return (
    <article
      className={`rounded border p-4 mb-3 ${aviso.urgente ? "bg-red-50 border-red-300" : "bg-white border-stone-200"}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {aviso.urgente && <AlertTriangle size={16} className="text-red-700" />}
        <h4 className={`font-medium ${aviso.urgente ? "text-red-800" : "text-stone-800"}`}>{aviso.titulo}</h4>
        {aviso.urgente && <span className="text-xs font-medium text-red-800 border border-red-300 rounded px-1.5">URGENTE</span>}
      </div>
      <p className="text-sm text-stone-700 mb-2">{aviso.contenido}</p>
      <p className="text-xs text-stone-500 flex items-center gap-1">
        <Clock size={12} /> {fmtFechaHora(aviso.fechaHora)} · {autor}
      </p>
    </article>
  );
}

function Avisos({ avisos, residentes, notificaciones, currentUser }) {
  const ordenados = [...avisos].sort((a, b) => b.fechaHora.localeCompare(a.fechaHora)); // más reciente primero
  const urgentes = ordenados.filter((a) => a.urgente);
  const generales = ordenados.filter((a) => !a.urgente);
  const mias = notificaciones.filter((n) => n.residenteId === currentUser.id).sort((a, b) => b.id - a.id);
  const autor = (id) => residentes.find((r) => r.id === id)?.nombre ?? "—";

  return (
    <div>
      <EncabezadoHU
        tabId="avisos"
        titulo="Avisos y notificaciones"
        historia="Como residente, quiero ver los avisos generales y las notificaciones urgentes de la mesa directiva, además de mis notificaciones de adeudo."
      />

      {mias.length > 0 && (
        <section className="mb-8">
          <h3 className={subtitulo}>Mis notificaciones ({mias.length})</h3>
          {mias.map((n) => (
            <div key={n.id} className="rounded border border-amber-200 bg-amber-50 p-3 mb-2 text-sm text-amber-900">
              <span className="font-medium">{ETIQUETA_NOTIF[n.tipo] ?? n.tipo} · {fmtFecha(n.fecha)}.</span> {n.mensaje}
            </div>
          ))}
        </section>
      )}

      <section className="mb-8">
        <h3 className={subtitulo}>Notificaciones urgentes ({urgentes.length})</h3>
        {urgentes.length === 0 && <p className="text-sm text-stone-500">No hay notificaciones urgentes.</p>}
        {urgentes.map((a) => (
          <TarjetaAviso key={a.id} aviso={a} autor={autor(a.autorId)} />
        ))}
      </section>

      <section>
        <h3 className={subtitulo}>Avisos generales ({generales.length})</h3>
        {generales.length === 0 && <p className="text-sm text-stone-500">No hay avisos publicados.</p>}
        {generales.map((a) => (
          <TarjetaAviso key={a.id} aviso={a} autor={autor(a.autorId)} />
        ))}
      </section>
    </div>
  );
}

function PublicarAvisos({ avisos, residentes, currentUser, onPublicar }) {
  const puedeGeneral = PUEDEN_AVISO_GENERAL.includes(currentUser.rol);
  const [tipo, setTipo] = useState(puedeGeneral ? "general" : "urgente");
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const tipoActivo = puedeGeneral ? tipo : "urgente";
  const historial = [...avisos].sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));
  const autor = (id) => residentes.find((r) => r.id === id)?.nombre ?? "—";

  function handleSubmit(e) {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) {
      setError("Escribe el título y el contenido del aviso.");
      setOk("");
      return;
    }
    const aviso = onPublicar({ titulo: titulo.trim(), contenido: contenido.trim(), urgente: tipoActivo === "urgente" });
    setTitulo("");
    setContenido("");
    setError("");
    setOk(
      aviso.urgente
        ? `Notificación urgente publicada el ${fmtFechaHora(aviso.fechaHora)} · ya la ven los residentes.`
        : `Aviso general publicado el ${fmtFechaHora(aviso.fechaHora)} · ya lo ven los residentes.`
    );
  }

  return (
    <div>
      <EncabezadoHU
        tabId="publicar"
        titulo="Publicar avisos"
        historia="Como secretario, quiero publicar avisos generales; como mesa directiva, quiero enviar notificaciones urgentes (corte de agua, luz, fumigación) para que los residentes estén al tanto."
      />

      <form onSubmit={handleSubmit} className="max-w-md bg-white border border-stone-200 rounded p-5 mb-8">
        <fieldset className="mb-3">
          <legend className="text-sm text-stone-600 mb-1">Tipo de publicación</legend>
          <label className={`flex items-center gap-2 text-sm mb-1 ${puedeGeneral ? "text-stone-800" : "text-stone-400"}`}>
            <input type="radio" name="tipo" value="general" disabled={!puedeGeneral} checked={tipoActivo === "general"} onChange={() => setTipo("general")} />
            Aviso general {!puedeGeneral && "(solo Secretario y Presidente)"}
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-800">
            <input type="radio" name="tipo" value="urgente" checked={tipoActivo === "urgente"} onChange={() => setTipo("urgente")} />
            Notificación urgente
          </label>
        </fieldset>
        <Field label="Título">
          <input className={inputClass} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej. Corte de agua programado" />
        </Field>
        <Field label="Contenido">
          <textarea className={inputClass} rows={4} value={contenido} onChange={(e) => setContenido(e.target.value)} placeholder="Describe el aviso para los residentes" />
        </Field>
        {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
        {ok && <p className="text-sm text-emerald-700 mb-3">{ok}</p>}
        <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">
          Publicar
        </button>
      </form>

      <h3 className={subtitulo}>Historial de publicaciones ({historial.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className={thClass}>Fecha y hora</th>
              <th className={thClass}>Tipo</th>
              <th className={thClass}>Título</th>
              <th className={thClass}>Publicó</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((a) => (
              <tr key={a.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-600">{fmtFechaHora(a.fechaHora)}</td>
                <td className={`py-2 pr-4 ${a.urgente ? "text-red-700 font-medium" : "text-stone-600"}`}>{a.urgente ? "Urgente" : "General"}</td>
                <td className="py-2 pr-4 text-stone-800">{a.titulo}</td>
                <td className="py-2 pr-4 text-stone-600">{autor(a.autorId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =====================================================================
// SPRINT 3
// =====================================================================

const TIPOS_INCIDENCIA = ["Alumbrado", "Seguridad", "Limpieza", "Otro"];
const ESTATUS_INCIDENCIA = ["Pendiente", "En atención", "Resuelta"];
const ESTATUS_MANTENIMIENTO = ["Solicitada", "Asignada", "En proceso", "Concluida"];

const ESTATUS_GENERAL_CLASE = {
  Pendiente: "text-amber-800 bg-amber-50 border-amber-200",
  "En atención": "text-sky-800 bg-sky-50 border-sky-200",
  Resuelta: "text-emerald-800 bg-emerald-50 border-emerald-200",
  Solicitada: "text-amber-800 bg-amber-50 border-amber-200",
  Asignada: "text-sky-800 bg-sky-50 border-sky-200",
  "En proceso": "text-indigo-800 bg-indigo-50 border-indigo-200",
  Concluida: "text-emerald-800 bg-emerald-50 border-emerald-200",
  Abierta: "text-emerald-800 bg-emerald-50 border-emerald-200",
  Cerrada: "text-stone-700 bg-stone-100 border-stone-300",
};

function Pill({ texto }) {
  return <span className={`inline-block text-xs px-2 py-0.5 rounded border ${ESTATUS_GENERAL_CLASE[texto] ?? ""}`}>{texto}</span>;
}

// ---------- HU-11 · Directorio de emergencia ----------
function Emergencias({ contactos, currentUser, onAgregar, onEditar, onEliminar }) {
  const esMesa = MESA_DIRECTIVA.includes(currentUser.rol);
  const caseta = contactos.find((c) => c.rapido) ?? contactos[0];
  const [form, setForm] = useState({ nombre: "", telefono: "", detalle: "" });
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({ nombre: "", telefono: "", detalle: "" });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError("Escribe el nombre y el teléfono del contacto.");
      return;
    }
    onAgregar({ nombre: form.nombre.trim(), telefono: form.telefono.trim(), detalle: form.detalle.trim() });
    setForm({ nombre: "", telefono: "", detalle: "" });
    setError("");
  }

  function guardarEdicion(id) {
    if (!draft.nombre.trim() || !draft.telefono.trim()) {
      setError("El nombre y el teléfono no pueden quedar vacíos.");
      return;
    }
    onEditar(id, { nombre: draft.nombre.trim(), telefono: draft.telefono.trim(), detalle: draft.detalle.trim() });
    setEditId(null);
    setError("");
  }

  return (
    <div>
      <EncabezadoHU
        tabId="emergencias"
        titulo="Directorio de emergencia"
        historia="Como residente, quiero contar con un directorio de emergencia y un botón de contacto rápido, para solicitar ayuda de forma inmediata ante una eventualidad."
      />

      {caseta && (
        <div className="max-w-md bg-red-50 border border-red-300 rounded p-5 mb-8">
          <p className="text-xs uppercase tracking-wide text-red-800 mb-1">Contacto rápido</p>
          <p className="text-sm text-stone-700 mb-3">{caseta.nombre} · <span className="font-medium">{caseta.telefono}</span></p>
          <a
            href={`tel:${caseta.telefono.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white text-sm font-medium px-4 py-2 rounded"
          >
            <PhoneCall size={16} /> Llamar a la caseta
          </a>
        </div>
      )}

      <h3 className={subtitulo}>Números de emergencia ({contactos.length})</h3>
      {error && <p className="text-sm text-red-700 mb-2">{error}</p>}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className={thClass}>Contacto</th>
              <th className={thClass}>Teléfono</th>
              <th className={thClass}>Detalle</th>
              {esMesa && <th className={thClass}>Panel de la mesa directiva</th>}
            </tr>
          </thead>
          <tbody>
            {contactos.map((c) =>
              editId === c.id ? (
                <tr key={c.id} className="border-b border-stone-100">
                  <td className="py-2 pr-2"><input aria-label="Editar nombre" className={inputClass} value={draft.nombre} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} /></td>
                  <td className="py-2 pr-2"><input aria-label="Editar teléfono" className={inputClass} value={draft.telefono} onChange={(e) => setDraft({ ...draft, telefono: e.target.value })} /></td>
                  <td className="py-2 pr-2"><input aria-label="Editar detalle" className={inputClass} value={draft.detalle} onChange={(e) => setDraft({ ...draft, detalle: e.target.value })} /></td>
                  <td className="py-2 pr-2 whitespace-nowrap">
                    <button onClick={() => guardarEdicion(c.id)} className="text-xs px-2 py-1 rounded bg-emerald-800 text-white mr-1">Guardar</button>
                    <button onClick={() => setEditId(null)} className="text-xs px-2 py-1 rounded border border-stone-300">Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="border-b border-stone-100">
                  <td className="py-2 pr-4 text-stone-800">{c.nombre}</td>
                  <td className="py-2 pr-4 text-stone-800 font-medium">{c.telefono}</td>
                  <td className="py-2 pr-4 text-stone-600">{c.detalle}</td>
                  {esMesa && (
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <button
                        onClick={() => { setEditId(c.id); setDraft({ nombre: c.nombre, telefono: c.telefono, detalle: c.detalle }); }}
                        aria-label={`Editar ${c.nombre}`}
                        className="text-xs px-2 py-1 rounded border border-stone-300 hover:bg-stone-100 mr-1"
                      >Editar</button>
                      <button onClick={() => onEliminar(c.id)} aria-label={`Eliminar ${c.nombre}`} className="text-xs px-2 py-1 rounded border border-red-300 text-red-800 hover:bg-red-50">Eliminar</button>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {esMesa && (
        <form onSubmit={handleSubmit} className="max-w-md bg-white border border-stone-200 rounded p-5">
          <h3 className="text-sm font-medium text-stone-700 mb-3">Agregar contacto al directorio</h3>
          <Field label="Nombre del contacto">
            <input className={inputClass} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Bomberos" />
          </Field>
          <Field label="Teléfono">
            <input className={inputClass} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="Ej. 442-100-0000" />
          </Field>
          <Field label="Detalle (opcional)">
            <input className={inputClass} value={form.detalle} onChange={(e) => setForm({ ...form, detalle: e.target.value })} placeholder="Ej. Atención las 24 horas" />
          </Field>
          <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">Agregar contacto</button>
        </form>
      )}
    </div>
  );
}

// ---------- HU-12 · Registro de incidencias ----------
function Incidencias({ incidencias, residentes, currentUser, hoy, onRegistrar, onCambiarEstatus }) {
  const esMesa = MESA_DIRECTIVA.includes(currentUser.rol);
  const [tipo, setTipo] = useState(TIPOS_INCIDENCIA[0]);
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const visibles = (esMesa ? incidencias : incidencias.filter((i) => i.residenteId === currentUser.id)).slice().sort((a, b) => b.id - a.id);
  const nombre = (id) => residentes.find((r) => r.id === id)?.nombre ?? "—";

  function handleSubmit(e) {
    e.preventDefault();
    if (!descripcion.trim()) {
      setError("Describe la incidencia.");
      setOk("");
      return;
    }
    onRegistrar({ tipo, descripcion: descripcion.trim() });
    setDescripcion("");
    setError("");
    setOk(`Incidencia de ${tipo.toLowerCase()} registrada. Puedes seguir su estatus en esta pantalla.`);
  }

  return (
    <div>
      <EncabezadoHU
        tabId="incidencias"
        titulo="Registro de incidencias"
        historia="Como residente, quiero registrar y dar seguimiento a incidencias (alumbrado, seguridad, limpieza), para que la mesa directiva las atienda de forma oportuna."
      />

      <form onSubmit={handleSubmit} className="max-w-md bg-white border border-stone-200 rounded p-5 mb-8">
        <Field label="Tipo de incidencia">
          <select className={inputClass} value={tipo} onChange={(e) => setTipo(e.target.value)} aria-label="Tipo de incidencia">
            {TIPOS_INCIDENCIA.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Descripción">
          <textarea className={inputClass} rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. Lámpara fundida frente a la vivienda B-04" />
        </Field>
        {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
        {ok && <p className="text-sm text-emerald-700 mb-3">{ok}</p>}
        <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">Registrar incidencia</button>
      </form>

      <h3 className={subtitulo}>{esMesa ? `Incidencias del residencial (${visibles.length})` : `Mis incidencias (${visibles.length})`}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className={thClass}>Fecha</th>
              {esMesa && <th className={thClass}>Residente</th>}
              <th className={thClass}>Tipo</th>
              <th className={thClass}>Descripción</th>
              <th className={thClass}>Estatus</th>
              <th className={thClass}>Historial</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 && (
              <tr><td colSpan={esMesa ? 6 : 5} className="py-3 text-stone-500">Aún no hay incidencias registradas.</td></tr>
            )}
            {visibles.map((i) => (
              <tr key={i.id} className="border-b border-stone-100 align-top">
                <td className="py-2 pr-4 text-stone-600">{fmtFecha(i.fecha)}</td>
                {esMesa && <td className="py-2 pr-4 text-stone-800">{nombre(i.residenteId)}</td>}
                <td className="py-2 pr-4 text-stone-800">{i.tipo}</td>
                <td className="py-2 pr-4 text-stone-600">{i.descripcion}</td>
                <td className="py-2 pr-4">
                  {esMesa ? (
                    <select
                      aria-label={`Estatus de la incidencia ${i.id}`}
                      className="border border-stone-300 rounded px-2 py-1 text-xs"
                      value={i.estatus}
                      onChange={(e) => onCambiarEstatus(i.id, e.target.value)}
                    >
                      {ESTATUS_INCIDENCIA.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  ) : (
                    <Pill texto={i.estatus} />
                  )}
                </td>
                <td className="py-2 pr-4 text-xs text-stone-500">
                  {i.historial.map((h, k) => (
                    <span key={k} className="block">{fmtFecha(h.fecha)} · {h.estatus}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- HU-13 · Solicitud de mantenimiento ----------
function FilaMantenimiento({ m, nombreResidente, onActualizar }) {
  const [responsable, setResponsable] = useState(m.responsable);
  const [estatus, setEstatus] = useState(m.estatus);
  const [error, setError] = useState("");

  function guardar() {
    if (estatus !== "Solicitada" && !responsable.trim()) {
      setError("Indica quién atenderá la solicitud.");
      return;
    }
    setError("");
    onActualizar(m.id, { responsable: responsable.trim(), estatus });
  }

  return (
    <tr className="border-b border-stone-100 align-top">
      <td className="py-2 pr-4 text-stone-600">{fmtFecha(m.fecha)}</td>
      <td className="py-2 pr-4 text-stone-800">{nombreResidente}</td>
      <td className="py-2 pr-4 text-stone-600">{m.descripcion}{m.ubicacion ? ` (${m.ubicacion})` : ""}</td>
      <td className="py-2 pr-4">
        <input aria-label={`Responsable de la solicitud ${m.id}`} className="border border-stone-300 rounded px-2 py-1 text-xs w-32 mb-1" value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Responsable" />
        <select aria-label={`Estatus de la solicitud ${m.id}`} className="block border border-stone-300 rounded px-2 py-1 text-xs mb-1" value={estatus} onChange={(e) => setEstatus(e.target.value)}>
          {ESTATUS_MANTENIMIENTO.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={guardar} aria-label={`Guardar solicitud ${m.id}`} className="text-xs px-2 py-1 rounded bg-emerald-800 text-white">Guardar</button>
        {error && <p className="text-xs text-red-700 mt-1">{error}</p>}
      </td>
    </tr>
  );
}

function Mantenimiento({ mantenimientos, residentes, currentUser, onSolicitar, onActualizar }) {
  const esMesa = MESA_DIRECTIVA.includes(currentUser.rol);
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const mias = mantenimientos.filter((m) => m.residenteId === currentUser.id).slice().sort((a, b) => b.id - a.id);
  const todas = mantenimientos.slice().sort((a, b) => b.id - a.id);
  const nombre = (id) => residentes.find((r) => r.id === id)?.nombre ?? "—";

  function handleSubmit(e) {
    e.preventDefault();
    if (!descripcion.trim()) {
      setError("Describe el problema que necesita mantenimiento.");
      setOk("");
      return;
    }
    onSolicitar({ descripcion: descripcion.trim(), ubicacion: ubicacion.trim() });
    setDescripcion("");
    setUbicacion("");
    setError("");
    setOk("Solicitud enviada. La mesa directiva la asignará y verás aquí su avance.");
  }

  return (
    <div>
      <EncabezadoHU
        tabId="mantenimiento"
        titulo="Solicitudes de mantenimiento"
        historia="Como residente, quiero solicitar y dar seguimiento a servicios de mantenimiento, para conocer el estatus de las reparaciones dentro del conjunto."
      />

      <form onSubmit={handleSubmit} className="max-w-md bg-white border border-stone-200 rounded p-5 mb-8">
        <Field label="Describe el problema">
          <textarea className={inputClass} rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. Fuga de agua en la bomba de la cisterna" />
        </Field>
        <Field label="Ubicación (opcional)">
          <input className={inputClass} value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ej. Área común, andador A" />
        </Field>
        {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
        {ok && <p className="text-sm text-emerald-700 mb-3">{ok}</p>}
        <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">Solicitar mantenimiento</button>
      </form>

      <h3 className={subtitulo}>Mis solicitudes ({mias.length})</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-300">
              <th className={thClass}>Fecha</th>
              <th className={thClass}>Solicitud</th>
              <th className={thClass}>Responsable</th>
              <th className={thClass}>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {mias.length === 0 && <tr><td colSpan={4} className="py-3 text-stone-500">Aún no has solicitado mantenimiento.</td></tr>}
            {mias.map((m) => (
              <tr key={m.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-600">{fmtFecha(m.fecha)}</td>
                <td className="py-2 pr-4 text-stone-800">{m.descripcion}{m.ubicacion ? ` (${m.ubicacion})` : ""}</td>
                <td className="py-2 pr-4 text-stone-600">{m.responsable || "Sin asignar"}</td>
                <td className="py-2 pr-4"><Pill texto={m.estatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {esMesa && (
        <section>
          <h3 className={subtitulo}>Seguimiento de la mesa directiva ({todas.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-300">
                  <th className={thClass}>Fecha</th>
                  <th className={thClass}>Residente</th>
                  <th className={thClass}>Solicitud</th>
                  <th className={thClass}>Asignación y estatus</th>
                </tr>
              </thead>
              <tbody>
                {todas.map((m) => (
                  <FilaMantenimiento key={`${m.id}-${m.estatus}-${m.responsable}`} m={m} nombreResidente={nombre(m.residenteId)} onActualizar={onActualizar} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

// ---------- HU-14 · Votaciones y encuestas ----------
const votacionCerrada = (v, hoy) => v.cerrada || v.cierre < hoy;

function TarjetaVotacion({ v, hoy, currentUser, esMesa, onVotar, onCerrar }) {
  const [opcion, setOpcion] = useState("");
  const [error, setError] = useState("");
  const cerrada = votacionCerrada(v, hoy);
  const yaVoto = Object.prototype.hasOwnProperty.call(v.votos, currentUser.id);
  const total = Object.keys(v.votos).length;
  const conteo = v.opciones.map((_, i) => Object.values(v.votos).filter((x) => x === i).length);
  const maximo = Math.max(...conteo);

  function votar(e) {
    e.preventDefault();
    if (opcion === "") {
      setError("Elige una opción antes de votar.");
      return;
    }
    onVotar(v.id, Number(opcion));
    setError("");
  }

  return (
    <article className="bg-white border border-stone-200 rounded p-5 mb-4 max-w-xl">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-medium text-stone-800">{v.pregunta}</h4>
        <Pill texto={cerrada ? "Cerrada" : "Abierta"} />
      </div>
      <p className="text-xs text-stone-500 mb-3">Cierra el {fmtFecha(v.cierre)} · {total} {total === 1 ? "voto" : "votos"} emitidos</p>

      {!cerrada && yaVoto && (
        <p className="flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 size={16} /> Tu voto quedó registrado. Los resultados se muestran al cerrar la votación.</p>
      )}
      {!cerrada && !yaVoto && (
        <form onSubmit={votar}>
          {v.opciones.map((o, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-stone-800 mb-1">
              <input type="radio" name={`voto-${v.id}`} value={i} checked={opcion === String(i)} onChange={() => setOpcion(String(i))} />
              {o}
            </label>
          ))}
          {error && <p className="text-sm text-red-700 my-2">{error}</p>}
          <button type="submit" aria-label={`Votar en ${v.pregunta}`} className="mt-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">Emitir voto</button>
        </form>
      )}
      {cerrada && (
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-500 mb-2">Resultado final</p>
          {v.opciones.map((o, i) => {
            const pct = total ? Math.round((conteo[i] / total) * 100) : 0;
            return (
              <div key={i} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span className={conteo[i] === maximo && total > 0 ? "font-medium text-emerald-900" : "text-stone-700"}>{o}</span>
                  <span className="text-stone-600">{conteo[i]} {conteo[i] === 1 ? "voto" : "votos"} · {pct} %</span>
                </div>
                <div className="h-2 bg-stone-100 rounded"><div className="h-2 rounded bg-emerald-700" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
          <p className="text-xs text-stone-500 mt-2">Total: {total} {total === 1 ? "voto" : "votos"}</p>
        </div>
      )}
      {esMesa && !cerrada && (
        <button onClick={() => onCerrar(v.id)} aria-label={`Cerrar votación ${v.pregunta}`} className="mt-3 text-xs px-2 py-1 rounded border border-stone-300 hover:bg-stone-100">Cerrar votación ahora</button>
      )}
    </article>
  );
}

function Votaciones({ votaciones, currentUser, hoy, onCrear, onVotar, onCerrar }) {
  const esMesa = MESA_DIRECTIVA.includes(currentUser.rol);
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState("");
  const [cierre, setCierre] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const lista = opciones.split("\n").map((o) => o.trim()).filter(Boolean);
    if (!pregunta.trim() || lista.length < 2 || !cierre) {
      setError("Escribe la pregunta, al menos dos opciones (una por línea) y la fecha de cierre.");
      setOk("");
      return;
    }
    if (cierre < hoy) {
      setError("La fecha de cierre no puede ser anterior a hoy.");
      setOk("");
      return;
    }
    onCrear({ pregunta: pregunta.trim(), opciones: lista, cierre });
    setPregunta("");
    setOpciones("");
    setCierre("");
    setError("");
    setOk("Votación creada. Los residentes ya pueden votar.");
  }

  const ordenadas = votaciones.slice().sort((a, b) => b.id - a.id);
  const abiertas = ordenadas.filter((v) => !votacionCerrada(v, hoy));
  const cerradas = ordenadas.filter((v) => votacionCerrada(v, hoy));

  return (
    <div>
      <EncabezadoHU
        tabId="votaciones"
        titulo="Votaciones y encuestas"
        historia="Como mesa directiva, quiero crear votaciones y encuestas con participación remota, para tomar decisiones junto con los residentes sin necesidad de asamblea presencial."
      />

      {esMesa && (
        <form onSubmit={handleSubmit} className="max-w-md bg-white border border-stone-200 rounded p-5 mb-8">
          <h3 className="text-sm font-medium text-stone-700 mb-3">Crear una votación</h3>
          <Field label="Pregunta">
            <input className={inputClass} value={pregunta} onChange={(e) => setPregunta(e.target.value)} placeholder="Ej. ¿Aprobamos pintar la fachada?" />
          </Field>
          <Field label="Opciones (una por línea)">
            <textarea className={inputClass} rows={3} value={opciones} onChange={(e) => setOpciones(e.target.value)} placeholder={"Sí\nNo"} />
          </Field>
          <Field label="Fecha de cierre">
            <input type="date" className={inputClass} value={cierre} onChange={(e) => setCierre(e.target.value)} />
          </Field>
          {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
          {ok && <p className="text-sm text-emerald-700 mb-3">{ok}</p>}
          <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded">Crear votación</button>
        </form>
      )}

      <h3 className={subtitulo}>Votaciones abiertas ({abiertas.length})</h3>
      {abiertas.length === 0 && <p className="text-sm text-stone-500 mb-6">No hay votaciones abiertas.</p>}
      {abiertas.map((v) => <TarjetaVotacion key={v.id} v={v} hoy={hoy} currentUser={currentUser} esMesa={esMesa} onVotar={onVotar} onCerrar={onCerrar} />)}

      <h3 className={`${subtitulo} mt-6`}>Votaciones cerradas ({cerradas.length})</h3>
      {cerradas.length === 0 && <p className="text-sm text-stone-500">Aún no hay resultados.</p>}
      {cerradas.map((v) => <TarjetaVotacion key={v.id} v={v} hoy={hoy} currentUser={currentUser} esMesa={esMesa} onVotar={onVotar} onCerrar={onCerrar} />)}
    </div>
  );
}

export default function App({ hoy: hoyProp } = {}) {
  const hoy = hoyProp ?? hoyLocal();
  const [residentes, setResidentes] = useState(initialResidentes);
  const [cuotas, setCuotas] = useState(initialCuotas);
  const [avisos, setAvisos] = useState(initialAvisos);
  const [notificaciones, setNotificaciones] = useState([]);
  const [contactos, setContactos] = useState(initialContactos);
  const [incidencias, setIncidencias] = useState(initialIncidencias);
  const [mantenimientos, setMantenimientos] = useState(initialMantenimientos);
  const [votaciones, setVotaciones] = useState(initialVotaciones);
  const [activeTab, setActiveTab] = useState("registro");
  const [currentUserId, setCurrentUserId] = useState(null);

  // A7: el usuario en sesión se deriva de la lista, así un cambio de rol se refleja de inmediato
  const currentUser = residentes.find((r) => r.id === currentUserId) ?? null;
  const tabActual = TABS.find((t) => t.id === activeTab);
  const urgentes = avisos.filter((a) => a.urgente).sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));

  function handleRegistrar(form) {
    setResidentes((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        nombre: form.nombre.trim(),
        email: form.email,
        telefono: form.telefono,
        vivienda: form.vivienda.trim(),
        rol: "Residente",
        password: form.password,
      },
    ]);
  }

  function handleCambiarRol(id, rol) {
    setResidentes((prev) => prev.map((r) => (r.id === id ? { ...r, rol } : r)));
  }

  function handleAgregarCuota(residenteId, mes, monto, vence) {
    setCuotas((prev) => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1, residenteId, mes, monto, vence, pagado: false, comprobante: null, recibo: null },
    ]);
  }

  // A13: pago en ventanilla; solo Tesorera o Presidente, queda registrado quién lo recibió
  function handlePagoVentanilla(id) {
    if (!currentUser || !PUEDEN_VALIDAR.includes(currentUser.rol)) return;
    setCuotas((prev) =>
      prev.map((c) =>
        c.id === id && !c.pagado
          ? { ...c, pagado: true, recibo: { folio: folioDe(c.id), fecha: hoy, validadoPor: currentUser.nombre, via: "Ventanilla" } }
          : c
      )
    );
  }

  // HU-06: el residente envía el comprobante; la cuota queda "En validación", no pagada
  function handleEnviarComprobante(id, datos) {
    setCuotas((prev) =>
      prev.map((c) =>
        c.id === id && c.residenteId === currentUserId && !c.pagado
          ? { ...c, comprobante: { ...datos, enviado: ahoraISO(), estado: "En validación" } }
          : c
      )
    );
  }

  // HU-06: solo al validar la cuota pasa a pagada y se emite el recibo; A14: no se valida el propio pago
  function handleValidar(id) {
    if (!currentUser || !PUEDEN_VALIDAR.includes(currentUser.rol)) return;
    setCuotas((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.pagado || c.comprobante?.estado !== "En validación") return c;
        if (c.residenteId === currentUser.id) return c;
        return {
          ...c,
          pagado: true,
          comprobante: { ...c.comprobante, estado: "Validado" },
          recibo: { folio: folioDe(c.id), fecha: hoy, validadoPor: currentUser.nombre, via: "Comprobante" },
        };
      })
    );
  }

  function handleRechazar(id, motivo) {
    if (!currentUser || !PUEDEN_VALIDAR.includes(currentUser.rol)) return;
    setCuotas((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.pagado || c.comprobante?.estado !== "En validación") return c;
        if (c.residenteId === currentUser.id) return c;
        return { ...c, comprobante: { ...c.comprobante, estado: "Rechazado", motivo } };
      })
    );
  }

  // HU-07: genera avisos de adeudo (vencidas) y recordatorios (vencen en 3 días), sin repetirlos el mismo día
  function handleGenerarNotificaciones() {
    const limite = sumarDias(hoy, DIAS_RECORDATORIO);
    let siguienteId = notificaciones.length ? Math.max(...notificaciones.map((n) => n.id)) + 1 : 1;
    const nuevas = [];
    cuotas.forEach((c) => {
      const estatus = estatusCuota(c, hoy);
      let tipo = null;
      if (estatus === "Vencida") tipo = "Vencida";
      else if (estatus === "Pendiente" && c.vence <= limite) tipo = "Recordatorio";
      if (!tipo) return;
      if (notificaciones.some((n) => n.cuotaId === c.id && n.fecha === hoy && n.tipo === tipo)) return;
      const mensaje =
        tipo === "Vencida"
          ? `Tu cuota de ${c.mes} (${money(c.monto)}) venció el ${fmtFecha(c.vence)}. Regístrala en “Pagos y comprobantes”.`
          : `Tu cuota de ${c.mes} (${money(c.monto)}) vence el ${fmtFecha(c.vence)}. Evita el adeudo pagando a tiempo.`;
      nuevas.push({ id: siguienteId++, residenteId: c.residenteId, cuotaId: c.id, tipo, fecha: hoy, mensaje });
    });
    if (nuevas.length) setNotificaciones((prev) => [...nuevas, ...prev]);
    return nuevas.length;
  }

  // HU-09 / HU-10: aviso general (Secretario o Presidente) o notificación urgente (mesa directiva), con fecha y hora
  function handlePublicar({ titulo, contenido, urgente }) {
    const aviso = {
      id: avisos.length ? Math.max(...avisos.map((a) => a.id)) + 1 : 1,
      titulo,
      contenido,
      urgente,
      autorId: currentUser.id,
      fechaHora: ahoraISO(),
    };
    setAvisos((prev) => [...prev, aviso]);
    return aviso;
  }

  const esMesaActual = !!currentUser && MESA_DIRECTIVA.includes(currentUser.rol);
  const siguienteId = (lista) => (lista.length ? Math.max(...lista.map((x) => x.id)) + 1 : 1);

  // HU-11: la mesa directiva mantiene el directorio de emergencia
  function handleAgregarContacto(datos) {
    if (!esMesaActual) return;
    setContactos((prev) => [...prev, { id: siguienteId(prev), ...datos, rapido: false }]);
  }
  function handleEditarContacto(id, datos) {
    if (!esMesaActual) return;
    setContactos((prev) => prev.map((c) => (c.id === id ? { ...c, ...datos } : c)));
  }
  function handleEliminarContacto(id) {
    if (!esMesaActual) return;
    setContactos((prev) => prev.filter((c) => c.id !== id || c.rapido)); // el contacto rápido no se elimina
  }

  // HU-12: el residente registra; la mesa cambia el estatus y queda historial (A21)
  function handleRegistrarIncidencia({ tipo, descripcion }) {
    setIncidencias((prev) => [
      ...prev,
      { id: siguienteId(prev), residenteId: currentUser.id, tipo, descripcion, fecha: hoy, estatus: "Pendiente", historial: [{ estatus: "Pendiente", fecha: hoy }] },
    ]);
  }
  function handleCambiarEstatusIncidencia(id, estatus) {
    if (!esMesaActual) return;
    setIncidencias((prev) =>
      prev.map((i) => (i.id === id && i.estatus !== estatus ? { ...i, estatus, historial: [...i.historial, { estatus, fecha: hoy }] } : i))
    );
  }

  // HU-13: solicitud, asignación y aviso de cierre al residente (A19)
  function handleSolicitarMantenimiento({ descripcion, ubicacion }) {
    setMantenimientos((prev) => [
      ...prev,
      { id: siguienteId(prev), residenteId: currentUser.id, descripcion, ubicacion, fecha: hoy, estatus: "Solicitada", responsable: "" },
    ]);
  }
  function handleActualizarMantenimiento(id, { responsable, estatus }) {
    if (!esMesaActual) return;
    const actual = mantenimientos.find((m) => m.id === id);
    if (!actual) return;
    setMantenimientos((prev) => prev.map((m) => (m.id === id ? { ...m, responsable, estatus } : m)));
    if (estatus === "Concluida" && actual.estatus !== "Concluida") {
      setNotificaciones((prev) => [
        {
          id: siguienteId(prev),
          residenteId: actual.residenteId,
          tipo: "Mantenimiento",
          fecha: hoy,
          mensaje: `Tu solicitud de mantenimiento “${actual.descripcion}” concluyó. Atendió: ${responsable}.`,
        },
        ...prev,
      ]);
    }
  }

  // HU-14: votaciones de la mesa directiva; un voto por residente (A20)
  function handleCrearVotacion({ pregunta, opciones, cierre }) {
    if (!esMesaActual) return;
    setVotaciones((prev) => [...prev, { id: siguienteId(prev), pregunta, opciones, cierre, cerrada: false, votos: {} }]);
  }
  function handleVotar(id, opcion) {
    setVotaciones((prev) =>
      prev.map((v) => {
        if (v.id !== id || votacionCerrada(v, hoy)) return v;
        if (Object.prototype.hasOwnProperty.call(v.votos, currentUser.id)) return v;
        return { ...v, votos: { ...v.votos, [currentUser.id]: opcion } };
      })
    );
  }
  function handleCerrarVotacion(id) {
    if (!esMesaActual) return;
    setVotaciones((prev) => prev.map((v) => (v.id === id ? { ...v, cerrada: true } : v)));
  }

  function renderContenido() {
    if (!canAccess(activeTab, currentUser)) {
      return <AccesoRestringido tab={tabActual} user={currentUser} />;
    }
    switch (activeTab) {
      case "registro":
        return <RegistroResidentes residentes={residentes} onRegistrar={handleRegistrar} />;
      case "roles":
        return <RolesPermisos residentes={residentes} onCambiarRol={handleCambiarRol} />;
      case "login":
        return (
          <Login
            residentes={residentes}
            currentUser={currentUser}
            onLogin={(r) => setCurrentUserId(r.id)}
            onLogout={() => setCurrentUserId(null)}
          />
        );
      case "cuotas":
        return (
          <Cuotas residentes={residentes} cuotas={cuotas} hoy={hoy} onAgregarCuota={handleAgregarCuota} onPagoVentanilla={handlePagoVentanilla} />
        );
      case "estado":
        return <EstadoCuenta key={currentUser.id} residentes={residentes} cuotas={cuotas} currentUser={currentUser} hoy={hoy} />;
      case "pagos":
        return (
          <Pagos
            key={currentUser.id}
            residentes={residentes}
            cuotas={cuotas}
            hoy={hoy}
            currentUser={currentUser}
            onEnviarComprobante={handleEnviarComprobante}
            onValidar={handleValidar}
            onRechazar={handleRechazar}
          />
        );
      case "adeudos":
        return <Adeudos residentes={residentes} cuotas={cuotas} notificaciones={notificaciones} hoy={hoy} onGenerar={handleGenerarNotificaciones} />;
      case "reportes":
        return <Reportes residentes={residentes} cuotas={cuotas} hoy={hoy} />;
      case "avisos":
        return <Avisos avisos={avisos} residentes={residentes} notificaciones={notificaciones} currentUser={currentUser} />;
      case "publicar":
        return <PublicarAvisos key={currentUser.id} avisos={avisos} residentes={residentes} currentUser={currentUser} onPublicar={handlePublicar} />;
      case "emergencias":
        return <Emergencias key={currentUser.id} contactos={contactos} currentUser={currentUser} onAgregar={handleAgregarContacto} onEditar={handleEditarContacto} onEliminar={handleEliminarContacto} />;
      case "incidencias":
        return <Incidencias key={currentUser.id} incidencias={incidencias} residentes={residentes} currentUser={currentUser} hoy={hoy} onRegistrar={handleRegistrarIncidencia} onCambiarEstatus={handleCambiarEstatusIncidencia} />;
      case "mantenimiento":
        return <Mantenimiento key={currentUser.id} mantenimientos={mantenimientos} residentes={residentes} currentUser={currentUser} onSolicitar={handleSolicitarMantenimiento} onActualizar={handleActualizarMantenimiento} />;
      case "votaciones":
        return <Votaciones key={currentUser.id} votaciones={votaciones} currentUser={currentUser} hoy={hoy} onCrear={handleCrearVotacion} onVotar={handleVotar} onCerrar={handleCerrarVotacion} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex text-stone-800">
      <aside className="w-64 shrink-0 bg-emerald-900 text-emerald-50 flex flex-col print:hidden">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-emerald-800">
          <Trees size={22} className="text-amber-400" />
          <div>
            <p className="font-serif text-lg leading-tight">S.U.D.I.</p>
            <p className="text-xs text-emerald-300 leading-tight">Residencial Los Robles</p>
          </div>
        </div>
        <nav className="flex-1 py-3">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const bloqueada = !canAccess(tab.id, currentUser);
            const nuevoSprint = i === 0 || TABS[i - 1].sprint !== tab.sprint;
            return (
              <div key={tab.id}>
                {nuevoSprint && (
                  <p className="px-5 pt-3 pb-1 text-[11px] uppercase tracking-wider text-emerald-400">Sprint {tab.sprint}</p>
                )}
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left border-l-4 ${
                    active
                      ? "border-amber-400 bg-emerald-800 text-white"
                      : "border-transparent text-emerald-100 hover:bg-emerald-800/60"
                  }`}
                >
                  <Icon size={17} />
                  <span className="flex-1">{tab.label}</span>
                  {bloqueada && <Lock size={14} className="text-emerald-400" aria-label="Sección restringida" />}
                </button>
              </div>
            );
          })}
        </nav>
        <div className="px-5 py-3 border-t border-emerald-800 text-xs">
          {currentUser ? (
            <>
              <p className="text-emerald-50">{currentUser.nombre}</p>
              <p className="text-emerald-300">{currentUser.rol}</p>
            </>
          ) : (
            <p className="text-emerald-300">Sin sesión iniciada</p>
          )}
        </div>
        <div className="px-5 py-4 border-t border-emerald-800 text-xs text-emerald-300">
          Sprint 3 · Proyecto S.U.D.I.<br />Materia Proyecto 2 — Scrum
        </div>
      </aside>

      <main className="flex-1 px-8 py-8 max-w-4xl">
        {currentUser && urgentes.length > 0 && activeTab !== "avisos" && (
          <button
            onClick={() => setActiveTab("avisos")}
            className="w-full text-left flex items-start gap-2 bg-red-50 border border-red-300 text-red-800 rounded p-3 mb-6 print:hidden"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span className="text-sm">
              <span className="font-medium">Notificación urgente: {urgentes[0].titulo}.</span> {fmtFechaHora(urgentes[0].fechaHora)} · Ver detalle
            </span>
          </button>
        )}
        {renderContenido()}
      </main>
    </div>
  );
}
