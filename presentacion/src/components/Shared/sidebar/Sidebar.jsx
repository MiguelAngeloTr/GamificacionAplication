import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/Context";
import Button from "../../ui/Button";
import { MENU } from "./sidebar.menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

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

  const [open, setOpen] = useState(true);

  // 1) Decidir el rol principal (simple)
  let primaryRole = "colaborador";
  if (roles.includes("directiva")) primaryRole = "directiva";
  else if (roles.includes("coach")) primaryRole = "coach";

  // 2) Items a mostrar según rol
  const generalItems = MENU.common || [];
  const roleItems = MENU[primaryRole] || [];

  // 3) Título de sección
  const sectionTitle =
    primaryRole === "directiva" ? "Directiva" : primaryRole === "coach" ? "Coach" : "Plan Carrera";

  // 4) Cerrar en móvil al navegar
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
      {/* Top bar móvil */}
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

      {/* Overlay móvil */}
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
              Rol activo: <span className="text-slate-300">{primaryRole}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 flex flex-col gap-1">
          <div className="px-2 mt-1 text-[11px] uppercase tracking-wider text-slate-500">
            General
          </div>

          {generalItems.map((it) => (
            <Item key={it.to} {...it} onClick={closeOnMobile} />
          ))}

          <div className="my-3 border-t border-slate-800" />

          <div className="px-2 text-[11px] uppercase tracking-wider text-slate-500">
            {sectionTitle}
          </div>

          {roleItems.map((it) => (
            <Item key={it.to} {...it} onClick={closeOnMobile} />
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-slate-800">
          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3">
            <div className="text-xs text-slate-400 mb-2">Acciones</div>

            <Button
              onClick={() => {
                logout?.();
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
