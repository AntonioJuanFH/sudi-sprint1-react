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
} from "lucide-react";

/*
  S.U.D.I. — Sistema Único de Información, Residencial Los Robles
  Demo funcional del Sprint 1 (Actividad integradora, Proyecto 2 — Scrum)

  Cada sección de este archivo implementa una historia de usuario del
  Sprint 1 (ver Product Backlog / Sprint Backlog de la Actividad 2):

    HU-01  Registro y administración de residentes   -> RegistroResidentes
    HU-02  Roles y permisos                          -> RolesPermisos
    HU-03  Inicio de sesión y recuperación de acceso  -> Login
    HU-04  Registro de cuotas y adeudos               -> Cuotas
    HU-05  Consulta de estado de cuenta               -> EstadoCuenta

  No usa backend: el estado vive en memoria (useState) para efectos de
  esta demo académica. En producción cada función quedaría conectada a
  la base de datos definida en el proyecto de Base de Datos.
*/

const ROLES = ["Presidente", "Tesorera", "Secretario", "Residente"];

const initialResidentes = [
  { id: 1, nombre: "Ana Torres", email: "ana.torres@losrobles.mx", telefono: "442-100-0001", vivienda: "A-12", rol: "Presidente", password: "1234" },
  { id: 2, nombre: "Carlos Medina", email: "carlos.medina@losrobles.mx", telefono: "442-100-0002", vivienda: "B-04", rol: "Tesorera", password: "1234" },
  { id: 3, nombre: "Marta Reyes", email: "marta.reyes@losrobles.mx", telefono: "442-100-0003", vivienda: "C-07", rol: "Secretario", password: "1234" },
  { id: 4, nombre: "Jorge Paredes", email: "jorge.paredes@losrobles.mx", telefono: "442-100-0004", vivienda: "A-05", rol: "Residente", password: "1234" },
];

const initialCuotas = [
  { id: 1, residenteId: 4, mes: "Agosto 2026", monto: 850, pagado: true },
  { id: 2, residenteId: 4, mes: "Septiembre 2026", monto: 850, pagado: false },
  { id: 3, residenteId: 2, mes: "Septiembre 2026", monto: 850, pagado: true },
];

const TABS = [
  { id: "registro", label: "Registro de residentes", hu: "HU-01", icon: UserPlus },
  { id: "roles", label: "Roles y permisos", hu: "HU-02", icon: ShieldCheck },
  { id: "login", label: "Inicio de sesión", hu: "HU-03", icon: LogIn },
  { id: "cuotas", label: "Cuotas y adeudos", hu: "HU-04", icon: Wallet },
  { id: "estado", label: "Estado de cuenta", hu: "HU-05", icon: Receipt },
];

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

function RegistroResidentes({ residentes, onRegistrar }) {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", vivienda: "", password: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.vivienda || !form.password) {
      setError("Completa nombre, correo, vivienda y contraseña.");
      setOk("");
      return;
    }
    if (residentes.some((r) => r.email === form.email)) {
      setError("Ya existe un residente registrado con ese correo.");
      setOk("");
      return;
    }
    onRegistrar(form);
    setForm({ nombre: "", email: "", telefono: "", vivienda: "", password: "" });
    setError("");
    setOk(`Residente "${form.nombre}" registrado correctamente.`);
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
    const found = residentes.find((r) => r.email === email && r.password === password);
    if (!found) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    setError("");
    onLogin(found);
  }

  function handleRecovery(e) {
    e.preventDefault();
    const found = residentes.find((r) => r.email === recoveryEmail);
    setRecoveryMsg(
      found
        ? `Se envió un enlace de recuperación a ${recoveryEmail}.`
        : "No encontramos ninguna cuenta con ese correo."
    );
  }

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
          <p className="text-lg text-emerald-900 font-medium mb-4">{currentUser.nombre} · {currentUser.rol}</p>
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
            <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded mb-2">
              Iniciar sesión
            </button>
          </form>
          <p className="text-xs text-stone-500 mb-2">Cuenta de prueba: ana.torres@losrobles.mx / 1234</p>
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

function Cuotas({ residentes, cuotas, onAgregarCuota, onTogglePagado }) {
  const [residenteId, setResidenteId] = useState(residentes[0]?.id ?? "");
  const [mes, setMes] = useState("");
  const [monto, setMonto] = useState("850");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!residenteId || !mes || !monto) {
      setError("Completa residente, mes y monto.");
      return;
    }
    onAgregarCuota(Number(residenteId), mes, Number(monto));
    setMes("");
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
        actualizado el control financiero del residencial.
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
              <th className="py-2 pr-4">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((c) => (
              <tr key={c.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-800">{nombreResidente(c.residenteId)}</td>
                <td className="py-2 pr-4 text-stone-600">{c.mes}</td>
                <td className="py-2 pr-4 text-stone-600">${c.monto.toLocaleString("es-MX")}</td>
                <td className="py-2 pr-4">
                  <button
                    onClick={() => onTogglePagado(c.id)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
                      c.pagado
                        ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                        : "text-amber-800 bg-amber-50 border-amber-200"
                    }`}
                  >
                    {c.pagado ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    {c.pagado ? "Pagado" : "Pendiente"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EstadoCuenta({ residentes, cuotas, currentUser }) {
  const [residenteId, setResidenteId] = useState(currentUser?.id ?? residentes[0]?.id ?? "");
  const residente = residentes.find((r) => r.id === Number(residenteId));
  const cuotasResidente = cuotas.filter((c) => c.residenteId === Number(residenteId));
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
        <Field label="Selecciona un residente">
          <select className={inputClass} value={residenteId} onChange={(e) => setResidenteId(e.target.value)}>
            {residentes.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre} · {r.vivienda}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mb-8">
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total pagado</p>
          <p className="text-2xl font-serif text-emerald-800">${totalPagado.toLocaleString("es-MX")}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded p-4">
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Adeudo pendiente</p>
          <p className="text-2xl font-serif text-amber-700">${totalAdeudo.toLocaleString("es-MX")}</p>
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
              <th className="py-2 pr-4">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {cuotasResidente.length === 0 && (
              <tr><td colSpan={3} className="py-3 text-stone-500">Sin movimientos registrados.</td></tr>
            )}
            {cuotasResidente.map((c) => (
              <tr key={c.id} className="border-b border-stone-100">
                <td className="py-2 pr-4 text-stone-800">{c.mes}</td>
                <td className="py-2 pr-4 text-stone-600">${c.monto.toLocaleString("es-MX")}</td>
                <td className="py-2 pr-4 text-stone-600">{c.pagado ? "Pagado" : "Pendiente"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [residentes, setResidentes] = useState(initialResidentes);
  const [cuotas, setCuotas] = useState(initialCuotas);
  const [activeTab, setActiveTab] = useState("registro");
  const [currentUser, setCurrentUser] = useState(null);

  function handleRegistrar(form) {
    setResidentes((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1,
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        vivienda: form.vivienda,
        rol: "Residente",
        password: form.password,
      },
    ]);
  }

  function handleCambiarRol(id, rol) {
    setResidentes((prev) => prev.map((r) => (r.id === id ? { ...r, rol } : r)));
  }

  function handleAgregarCuota(residenteId, mes, monto) {
    setCuotas((prev) => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1, residenteId, mes, monto, pagado: false },
    ]);
  }

  function handleTogglePagado(id) {
    setCuotas((prev) => prev.map((c) => (c.id === id ? { ...c, pagado: !c.pagado } : c)));
  }

  return (
    <div className="min-h-screen bg-stone-50 flex text-stone-800">
      <aside className="w-64 bg-emerald-900 text-emerald-50 flex flex-col">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-emerald-800">
          <Trees size={22} className="text-amber-400" />
          <div>
            <p className="font-serif text-lg leading-tight">S.U.D.I.</p>
            <p className="text-xs text-emerald-300 leading-tight">Residencial Los Robles</p>
          </div>
        </div>
        <nav className="flex-1 py-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-left border-l-4 ${
                  active
                    ? "border-amber-400 bg-emerald-800 text-white"
                    : "border-transparent text-emerald-100 hover:bg-emerald-800/60"
                }`}
              >
                <Icon size={17} />
                <span className="flex-1">{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-emerald-800 text-xs text-emerald-300">
          Sprint 1 · Proyecto S.U.D.I.<br />Materia Proyecto 2 — Scrum
        </div>
      </aside>

      <main className="flex-1 px-8 py-8 max-w-3xl">
        {activeTab === "registro" && <RegistroResidentes residentes={residentes} onRegistrar={handleRegistrar} />}
        {activeTab === "roles" && <RolesPermisos residentes={residentes} onCambiarRol={handleCambiarRol} />}
        {activeTab === "login" && (
          <Login residentes={residentes} currentUser={currentUser} onLogin={setCurrentUser} onLogout={() => setCurrentUser(null)} />
        )}
        {activeTab === "cuotas" && (
          <Cuotas residentes={residentes} cuotas={cuotas} onAgregarCuota={handleAgregarCuota} onTogglePagado={handleTogglePagado} />
        )}
        {activeTab === "estado" && <EstadoCuenta residentes={residentes} cuotas={cuotas} currentUser={currentUser} />}
      </main>
    </div>
  );
}
