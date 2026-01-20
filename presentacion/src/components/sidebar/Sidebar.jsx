import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/Context";
import Button from "../ui/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faUser,
  faTrophy,
  faTachometerAlt,
  faTimes,
  faBars,
  faSearch,
  faSignOutAlt,
  faFolderOpen,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition select-none";
const linkIdle = "text-slate-300 hover:text-white hover:bg-slate-800/60";
const linkActive = "bg-slate-800 text-white ring-1 ring-slate-700";

function Item({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkIdle}`
      }
    >
      <span className="w-5 h-5 grid place-items-center opacity-90">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, roles = [], logout } = useAuth();
  const location = useLocation();

  // abierto por defecto en desktop, cerrado en móvil (se abre con el botón)
  const [open, setOpen] = useState(true);

  // Si navegas, en móvil lo cerramos para que no estorbe.
  // En desktop lo dejamos abierto.
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) setOpen(false);
  }, [location.pathname]);

  const closeOnMobile = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) setOpen(false);
  };

  return (
    <>
      {/* Top bar móvil (botón hamburguesa) */}
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-3 bg-slate-950 text-white border-b border-slate-800 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-9 w-9 grid place-items-center rounded-lg border border-slate-800 bg-slate-900/60"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          <FontAwesomeIcon icon={open ? faTimes : faBars} />
        </button>
        <div className="font-semibold tracking-wide">VortexBird</div>
        <div className="ml-auto text-xs text-slate-400 truncate">
          {user?.nombre ?? "—"}
        </div>
      </div>

      {/* Overlay cuando está abierto en móvil */}
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          aria-label="Cerrar overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed md:static z-40 md:z-auto",
          "top-0 md:top-auto left-0",
          "h-screen md:min-h-screen",
          "w-72",
          "bg-slate-950 text-white border-r border-slate-800",
          "flex flex-col",
          "transform transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 ring-1 ring-slate-700" />
            <div className="leading-tight">
              <div className="font-semibold tracking-wide">Synaptek Solutions</div>
              <div className="text-xs text-slate-400">Panel Operativo</div>
            </div>

            {/* Botón cerrar (solo móvil dentro del sidebar) */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="md:hidden ml-auto h-9 w-9 grid place-items-center rounded-lg border border-slate-800 bg-slate-900/60"
              aria-label="Cerrar menú"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* User card */}
          <div className="mt-4 rounded-xl bg-slate-900/60 border border-slate-800 p-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">
              Sesión
            </div>
            <div className="mt-1 font-semibold truncate">{user?.nombre ?? "—"}</div>
            <div className="text-xs text-slate-300 truncate">{user?.correo ?? "—"}</div>
            <div className="mt-2 text-[11px] text-slate-400">
              Roles:{" "}
              <span className="text-slate-300">{roles.join(", ") || "—"}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 flex flex-col gap-1">
          <div className="px-2 mt-1 text-[11px] uppercase tracking-wider text-slate-500">
            General
          </div>

          <Item
            to="/dashboard"
            label="Dashboard"
            icon={faTachometerAlt}
            onClick={closeOnMobile}
          />

          <Item
            to="/perfil"
            label="Perfil"
            icon={faUser}
            onClick={closeOnMobile}
          />

          <div className="my-3 border-t border-slate-800" />

          <div className="px-2 text-[11px] uppercase tracking-wider text-slate-500">
            Plan Carrera
          </div>

          <Item
            to="/retorno"
            label="Unidades Retorno"
            icon={faRotateLeft}
            onClick={closeOnMobile}
          />

          <Item
            to="/PerRecompensa"
            label="Recompensas"
            icon={faAward}
            onClick={closeOnMobile}
          />

          <Item
            to="/logro"
            label="Logros"
            icon={faTrophy}
            onClick={closeOnMobile}
          />

          <Item
            to="/consultaActividad"
            label="Consultar Avance"
            icon={faSearch}
            onClick={closeOnMobile}
          />

          <Item
            to="/files"
            label="Archivos"
            icon={faFolderOpen}
            onClick={closeOnMobile}
          />
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-slate-800">
          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3">
            <div className="text-xs text-slate-400 mb-2">Acciones</div>

            {/* Logout */}
            <Button
              onClick={() => {
                logout?.();
                // opcional: si quieres forzar cierre en móvil
                setOpen(false);
              }}
              className="w-full"
            >
              <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faSignOutAlt} />
                Cerrar sesión
              </span>
            </Button>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">v0.1 • UI Sidebar</div>
        </div>
      </aside>
    </>
  );
}
