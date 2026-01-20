// src/auth/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) POST /api/auth/login (backend setea cookie)
      // 2) AuthContext hace checkSession() → GET /api/auth/me (user + roles)
      await login({ email, password });
      // Redirección
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Correo"
        type="email"
        autoComplete="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" loading={loading}>
        Iniciar sesión
      </Button>
    </form>
  );
}
