"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AnimatedBackground from "@/components/animatedBackground";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams?.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Token inválido o expirado");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al restablecer la contraseña");
      } else {
        alert("Contraseña actualizada con éxito, ahora puedes iniciar sesión");
        router.push("auth/login");
      }
    } catch (error) {
      console.error("Error en reset-password:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      <AnimatedBackground />

      <div className="bg-[#0f1c2b] text-white p-8 rounded-2xl shadow-lg w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-6">
          <span className="text-6xl mb-2">🔑</span>
          <h2 className="text-2xl font-bold text-center">Restablecer contraseña</h2>
          <p className="text-sm text-cyan-400 text-center mt-2">
            Ingresa tu nueva contraseña y confírmala.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#162435] border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
