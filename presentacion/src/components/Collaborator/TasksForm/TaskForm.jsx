// src/components/TasksForm/TaskForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { actividadesApi } from "../../../api/actividades.api";

/**
 * Basado en tu JSON real:
 * {
 *  id, nombre, estado (number 0/1), descripcion, fecha_inicio, fecha_final,
 *  tipo, archivo, usuario_id, plan_id, created_at
 * }
 *
 * Este form envía SOLO lo editable y esperado por backend:
 * nombre, descripcion, tipo, fecha_inicio, fecha_final, estado
 *
 * NOTA: usuario_id/plan_id normalmente se asignan en backend (por sesión o lógica de negocio).
 */

export default function TaskForm() {
  const { id } = useParams(); // /edit/:id
  const navigate = useNavigate();

  const isEdit = useMemo(() => Boolean(id), [id]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Campos
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");
  const [fechaInicio, setFechaInicio] = useState(""); // yyyy-mm-dd
  const [fechaFinal, setFechaFinal] = useState(""); // yyyy-mm-dd
  const [estado, setEstado] = useState(1); // 1 = activa/pendiente, 0 = inactiva/completada (AJUSTA si aplica)

  const toISODate = (value) => {
    if (!value) return "";
    // value puede venir como ISO con hora: 2026-01-06T05:00:00.000Z
    // o como yyyy-mm-dd
    const s = String(value);
    return s.length >= 10 ? s.slice(0, 10) : "";
  };

  const validate = () => {
    const n = nombre.trim();
    if (!n) return "El nombre es obligatorio";
    if (n.length < 3) return "El nombre debe tener al menos 3 caracteres";

    // Validación básica de fechas
    if (fechaInicio && fechaFinal) {
      const a = new Date(fechaInicio).getTime();
      const b = new Date(fechaFinal).getTime();
      if (Number.isFinite(a) && Number.isFinite(b) && b < a) {
        return "La fecha final no puede ser menor a la fecha inicio";
      }
    }

    return "";
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setError("");
      setLoading(true);

      try {
        if (!isEdit) return;

        const res = await actividadesApi.getById(id);
        const a = res?.data;

        if (!mounted) return;

        setNombre(a?.nombre ?? "");
        setDescripcion(a?.descripcion ?? "");
        setTipo(a?.tipo ?? "");
        setFechaInicio(toISODate(a?.fecha_inicio));
        setFechaFinal(toISODate(a?.fecha_final));
        // estado en tu JSON es número (ej: 1)
        setEstado(Number(a?.estado ?? 1));
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || "No se pudo cargar la actividad");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) return setError(msg);

    setSaving(true);
    try {
      // Payload alineado a tu BD / backend (con estado numérico)
      // - fecha_* se envía como 'YYYY-MM-DD' o null
      // - estado se envía como 0/1
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        tipo: tipo.trim() || null,
        fecha_inicio: fechaInicio || null,
        fecha_final: fechaFinal || null,
        estado: estado ? 1 : 0,
      };

      if (isEdit) {
        await actividadesApi.update(id, payload);
      } else {
        await actividadesApi.create(payload);
      }

      navigate("/consultaActividad", { replace: true });
    } catch (e2) {
      setError(e2?.response?.data?.message || "No se pudo guardar la actividad");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate(-1);

  if (loading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              {isEdit ? "Editar actividad" : "Crear actividad"}
            </h1>
            <p className="text-sm text-gray-500">
              Completa los campos y guarda los cambios.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Sesión práctica SQL"
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Descripción</label>
            <textarea
              className="border rounded px-3 py-2 min-h-[100px] focus:outline-none focus:ring focus:ring-black/20"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ejercicios, objetivo, entregables..."
            />
          </div>

          <Input
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder='Ej: "practica", "seguimiento", "curso"'
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <Input
              label="Fecha final"
              type="date"
              value={fechaFinal}
              onChange={(e) => setFechaFinal(e.target.value)}
            />
          </div>

          {/* Estado: lo mantengo con checkbox pero guardando 0/1 para MySQL */}
          <div className="flex items-center gap-2">
            <input
              id="estado"
              type="checkbox"
              checked={estado === 1}
              onChange={(e) => setEstado(e.target.checked ? 1 : 0)}
            />
            <label htmlFor="estado" className="text-sm text-gray-700">
              Activa
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <Button type="submit" loading={saving}>
              {isEdit ? "Guardar cambios" : "Crear"}
            </Button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full md:w-auto border rounded px-4 py-2 text-sm hover:bg-slate-50"
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
