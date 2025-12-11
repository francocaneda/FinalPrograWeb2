// src/password-recup/password-recup.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./password-recup.css";

export default function PasswordRecup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      const res = await fetch("/api/auth/password-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "No se pudo enviar el correo.");
      }

      alert("¡Listo! Te enviamos un link para recuperar la contraseña.");
      navigate("/"); // al login
      // o navigate(-1) si preferís volver a la pantalla previa
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isInvalid = !email.trim();

  return (
    <div className="recup-scope">
      <div className="wrapper fadeInDown">
        <div className="formContent">
          <div className="fadeIn first header">
            <div className="icon" aria-hidden />
            <h1>Recuperar o Modificar Contraseña</h1>
            <p className="subtitle">
              Le enviaremos un link a su correo para recuperar la contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="recup-email" className="label">
              Ingrese su Email de Usuario
            </label>

            <input
              type="email"
              id="recup-email"
              className="input fadeIn second"
              name="email"
              placeholder="Email de Usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isInvalid || loading}
              className={`submit-btn fadeIn fourth ${loading ? "loading" : ""} ${
                isInvalid ? "disabled" : ""
              }`}
            >
              {loading ? "Enviando..." : "Ingresar"}
            </button>

            {loading && <div className="spinner" aria-label="Cargando…" />}
          </form>

          <div className="formFooter">
            <Link className="underlineHover" to="/">Volver al Inicio de Sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
