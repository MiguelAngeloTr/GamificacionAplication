// src/components/Evidencias/Evidencia.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/Context";
import Input from "../ui/Input";
import Button from "../ui/Button";

import { evidenciasApi } from "../../api/evidencias.api";

export default function Evidencia() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [actividadId, setActividadId] = useState("");
  const [unidadId, setUnidadId] = useState("");
  const [file, setFile] = useState(null);

  const load = async () => {
    setError("");
    setFetching(true);
    try {
      // Esperado: lista de evidencias del usuario autenticado
      const res = await evidenciasApi.listMine();
      setItems(res.data ?? []);
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudieron cargar las evidencias");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) return setError("Selecciona un archivo");
    if (!actividadId && !unidadId) {
      return setError("Asocia la evidencia a una actividad o una unidad de retorno");
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name);
      form.append("type", file.type || "application/octet-stream");
      if (actividadId) form.append("actividad_id", actividadId);
      if (unidadId) form.append("unidad_id", unidadId);

      await evidenciasApi.upload(form);

      setFile(null);
      setActividadId("");
      setUnidadId("");
      await load();
    } catch (e2) {
      setError(e2?.response?.data?.message || "Error subiendo la evidencia");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (id, filename = `evidencia-${id}`) => {
    setError("");
    try {
      // Esperado: devuelve blob (responseType: "blob" en tu evidencias.api.js)
      const res = await evidenciasApi.downloadById(id);

      const contentType = res.headers?.["content-type"] || "application/octet-stream";
      const blob = new Blob([res.data], { type: contentType });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Si el backend manda content-disposition, intenta usarlo
      const cd = res.headers?.["content-disposition"];
      const match = cd?.match(/filename="(.+)"/);
      a.download = match?.[1] || filename;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo descargar la evidencia");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await evidenciasApi.remove(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo eliminar la evidencia");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-700">Debes iniciar sesión para ver evidencias.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Evidencias</h1>
          <p className="text-sm text-gray-500">
            Sube y gestiona archivos asociados a actividades o unidades de retorno.
          </p>
        </div>

        <button
          onClick={load}
          className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
          disabled={fetching}
        >
          {fetching ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {/* SUBIR */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="font-semibold mb-3">Subir evidencia</h2>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Actividad ID (opcional)"
            placeholder="Ej: 12"
            value={actividadId}
            onChange={(e) => setActividadId(e.target.value)}
          />

          <Input
            label="Unidad Retorno ID (opcional)"
            placeholder="Ej: 3"
            value={unidadId}
            onChange={(e) => setUnidadId(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Archivo</label>
            <input
              type="file"
              className="border rounded px-3 py-2"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className="md:col-span-3">
            <Button type="submit" loading={uploading}>
              Subir
            </Button>
          </div>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {/* LISTA */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Mis evidencias</h2>
        </div>

        {fetching ? (
          <div className="p-4 text-sm text-gray-600">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No hay evidencias aún.</div>
        ) : (
          <div className="divide-y">
            {items.map((ev) => (
              <div key={ev.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{ev.name || `Evidencia #${ev.id}`}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {ev.type ? `Tipo: ${ev.type} · ` : ""}
                    {ev.actividad_id ? `Actividad: ${ev.actividad_id} · ` : ""}
                    {ev.unidad_id ? `Unidad: ${ev.unidad_id} · ` : ""}
                    {ev.created_at ? `Fecha: ${new Date(ev.created_at).toLocaleString("es-CO")}` : ""}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => handleDownload(ev.id, ev.name || `evidencia-${ev.id}`)}
                  >
                    Descargar
                  </button>

                  <button
                    className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => handleDelete(ev.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Nota: para descargar, tu <code>evidenciasApi.downloadById</code> debe usar{" "}
        <code>responseType: "blob"</code>.
      </div>
    </div>
  );
}
