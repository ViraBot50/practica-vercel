"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [actualizando, setActualizando] = useState(false);


  async function cargar() {
    const inicio = performance.now();
    setCargando(true);

    try {
      const res = await fetch("/api/productos");
      const data = await res.json();
      const ms = Math.round(performance.now() - inicio);

      setLogs((prev) => [
        {
          hora: new Date().toLocaleTimeString(),
          metodo: "GET",
          url: "/api/productos",
          status: res.status,
          ms,
          respuesta: data,
        },
        ...prev,
      ].slice(0, 20));

      if (!res.ok) {
        setError(data?.error || "Error al cargar los productos");
        return;
      }

      setError("");
      setProductos(data);
    } catch {
      setError("No se pudo conectar con la API");
    } finally {
      setCargando(false);
    }
  }

  async function crearProducto(e) {
    e.preventDefault();

    setCreando(true);
    setError("");

    try {
      const inicio = performance.now();

      const res = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          descripcion,
        }),
      });

      const data = await res.json();
      const ms = Math.round(performance.now() - inicio);

      setLogs((prev) => [
        {
          hora: new Date().toLocaleTimeString(),
          metodo: "POST",
          url: "/api/productos",
          status: res.status,
          ms,
          respuesta: data,
        },
        ...prev,
      ].slice(0, 20));

      if (!res.ok) {
        setError(data?.error || "Error al crear el producto");
        return;
      }

      setNombre("");
      setPrecio("");
      setDescripcion("");

      await cargar();
    } catch {
      setError("No se pudo conectar con la API");
    } finally {
      setCreando(false);
    }
  }


  async function actualizarProducto(e) {
    e.preventDefault();

    setActualizando(true);
    setError("");

    try {
      const inicio = performance.now();

      const res = await fetch(`/api/productos/${editando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          descripcion,
        }),
      });

      const data = await res.json();
      const ms = Math.round(performance.now() - inicio);

      setLogs((prev) => [
        {
          hora: new Date().toLocaleTimeString(),
          metodo: "PUT",
          url: `/api/productos/${editando}`,
          status: res.status,
          ms,
          respuesta: data,
        },
        ...prev,
      ].slice(0, 20));

      if (!res.ok) {
        setError(data?.error || "Error al actualizar el producto");
        return;
      }

      setEditando(null);
      setNombre("");
      setPrecio("");
      setDescripcion("");

      await cargar();
    } catch {
      setError("No se pudo conectar con la API");
    } finally {
      setActualizando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Encabezado */}
        <header className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              CRUD de Productos
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Práctica de Git, Next.js, Supabase y Vercel
            </p>
          </div>

          <button
            onClick={cargar}
            disabled={cargando}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {cargando ? "Cargando..." : "Recargar Productos"}
          </button>
        </header>
        {/* Formulario para crear productos */}
        <section className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {editando ? "Editar producto" : "Crear producto"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editando
              ? "Modifica los datos del producto seleccionado"
              : "Registra un nuevo producto en Supabase"}
          </p>

          <form
            onSubmit={editando ? actualizarProducto : crearProducto}
            className="mt-5 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Teclado gamer"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Precio
              </label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej. 850"
                min="0"
                step="0.01"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe el producto"
                rows="3"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={creando || actualizando}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {actualizando
                ? "Guardando cambios..."
                : creando
                  ? "Creando..."
                  : editando
                    ? "Guardar cambios"
                    : "Crear producto"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setNombre("");
                  setPrecio("");
                  setDescripcion("");
                  setError("");
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </form>
        </section>
        {/* Sección de Productos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Productos registrados
              </h2>
              <p className="text-xs text-slate-500">
                Productos obtenidos en tiempo real desde Supabase
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {productos.length} {productos.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {productos.map((producto) => (
              <article
                key={producto.id}
                className="flex flex-col justify-between rounded-xl bg-white p-5 shadow-xs border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {producto.nombre}
                    </h3>
                    <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-800">
                      ${Number(producto.precio).toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {producto.descripcion}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>ID: {producto.id}</span>

                    {producto.created_at && (
                      <span>
                        {new Date(producto.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setEditando(producto.id);
                      setNombre(producto.nombre);
                      setPrecio(producto.precio);
                      setDescripcion(producto.descripcion || "");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mt-3 w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    Editar producto
                  </button>
                </div>
              </article>
            ))}
          </div>

          {productos.length === 0 && !error && !cargando && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No hay productos registrados.
            </div>
          )}
        </section>

        {/* Consola de Peticiones */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Consola de peticiones
              </h2>
              <p className="text-xs text-slate-500">
                Historial de solicitudes realizadas a la API
              </p>
            </div>

            <button
              onClick={() => setLogs([])}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Limpiar consola
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-200 shadow-inner">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic">Sin peticiones registradas aún.</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="mb-4 border-b border-slate-800 pb-4 last:mb-0 last:border-0 last:pb-0 space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400">{log.hora}</span>
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-bold text-amber-400 border border-amber-500/20">
                      {log.metodo}
                    </span>
                    <span className="text-slate-300">{log.url}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-bold ${log.status < 400
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-slate-400">{log.ms} ms</span>
                  </div>

                  <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-slate-300 text-[11px] leading-relaxed">
                    {JSON.stringify(log.respuesta, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}