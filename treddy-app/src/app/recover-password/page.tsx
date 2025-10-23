"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/animatedBackground";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/user/recover-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al solicitar recuperación");
      } else {
        alert("Te enviamos un correo con instrucciones para restablecer tu contraseña");
        router.push("auth/login");
      }
    } catch (error) {
      console.error("Error en forgot-password:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      {/* Fondo animado */}
      <AnimatedBackground />

      <div className="bg-[#0f1c2b] text-white p-8 rounded-2xl shadow-lg w-full max-w-md relative z-10">
        {/* Encabezado centrado */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-6xl mb-2">🐻</span>
          <h2 className="text-2xl font-bold text-center">Recuperar contraseña</h2>
          <p className="text-sm text-cyan-400 text-center mt-2">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#162435] border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar correo"}
          </button>
        </form>
      </div>
    </div>
  );
}
