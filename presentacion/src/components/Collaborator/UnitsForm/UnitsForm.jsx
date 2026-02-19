import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//  Asumo que ya existe según tu carpeta /api
import { unidadesApi } from "../../../api/unidades.api";

export default function UnitsForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = useMemo(() => Boolean(id), [id]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  //  Ajusta los campos a los que realmente uses en UNIDADES_RETORNO
  // (según tu ER: nombre, objetivo, estado, descripcion, nota, fecha, archivo)
  const [form, setForm] = useState({
    nombre: "",
    objetivo: "",
    estado: 1, // 1 activo, 0 inactivo (ajusta si manejas boolean)
    descripcion: "",
    nota: "",
    fecha: "",
    archivo: null, // File
  });

  // ---- Helpers ----
  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const loadUnit = async () => {
    setError("");
    setLoading(true);

    try {
      // Ajusta a tu método real: getById / getUnit / etc.
      const res = await unidadesApi.getById(id);

      const data = res.data;

      setForm((prev) => ({
        ...prev,
        nombre: data.nombre ?? "",
        objetivo: data.objetivo ?? "",
        estado: typeof data.estado === "number" ? data.estado : (data.estado ? 1 : 0),
        descripcion: data.descripcion ?? "",
        nota: data.nota ?? "",
        // Si viene "YYYY-MM-DD" ya sirve
        fecha: data.fecha ? String(data.fecha).slice(0, 10) : "",
        archivo: null, // no se precarga file por seguridad
      }));
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo cargar la unidad.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) loadUnit();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Si tu backend espera multipart (por archivo), usamos FormData.
      // Si NO manejas archivo, puedes enviar JSON normal.
      const hasFile = form.archivo instanceof File;

      if (hasFile) {
        const fd = new FormData();
        fd.append("nombre", form.nombre);
        fd.append("objetivo", form.objetivo);
        fd.append("estado", String(form.estado));
        fd.append("descripcion", form.descripcion);
        fd.append("nota", form.nota);
        fd.append("fecha", form.fecha);
        fd.append("archivo", form.archivo);

        if (isEdit) {
          await unidadesApi.updateMultipart(id, fd); //  si existe
        } else {
          await unidadesApi.createMultipart(fd); // si existe
        }
      } else {
        const payload = {
          nombre: form.nombre,
          objetivo: form.objetivo,
          estado: form.estado,
          descripcion: form.descripcion,
          nota: form.nota,
          fecha: form.fecha || null,
        };

        if (isEdit) {
          await unidadesApi.update(id, payload);
        } else {
          await unidadesApi.create(payload);
        }
      }

      navigate("/retorno", { replace: true });
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo guardar la unidad.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-sm text-gray-600">Cargando unidad...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">
          {isEdit ? "Editar unidad de retorno" : "Crear unidad de retorno"}
        </h1>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
        >
          Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Nombre</label>
            <input
              className="border rounded px-3 py-2"
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Objetivo</label>
            <input
              className="border rounded px-3 py-2"
              value={form.objetivo}
              onChange={(e) => setField("objetivo", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Estado</label>
            <select
              className="border rounded px-3 py-2"
              value={form.estado}
              onChange={(e) => setField("estado", Number(e.target.value))}
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Fecha</label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={form.fecha}
              onChange={(e) => setField("fecha", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-gray-700">Descripción</label>
            <textarea
              className="border rounded px-3 py-2 min-h-[110px]"
              value={form.descripcion}
              onChange={(e) => setField("descripcion", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-gray-700">Nota</label>
            <textarea
              className="border rounded px-3 py-2 min-h-[90px]"
              value={form.nota}
              onChange={(e) => setField("nota", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-gray-700">
              Archivo (opcional)
            </label>
            <input
              type="file"
              className="border rounded px-3 py-2"
              onChange={(e) => setField("archivo", e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-500">
              Si tu backend no soporta archivo, deja esto sin usar.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-3">{error}</p>
        )}

        <div className="flex gap-2 mt-5">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/retorno")}
            className="border rounded px-4 py-2 hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}