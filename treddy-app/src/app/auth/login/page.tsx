"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "../../../components/animatedBackground";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    contrasena: "",
    recordar: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          contrasena: form.contrasena,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error al iniciar sesión");
        return;
      }

      const data = await response.json();
      console.log("Sesión iniciada:", data);

      localStorage.setItem("token", data.token);

      alert("Inicio de sesión exitoso");
      router.push("/");
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* 🎨 Fondo animado */}
      <AnimatedBackground />

      <div className="relative bg-[#0f1c2b] text-white p-10 rounded-2xl shadow-lg w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full flex justify-center items-center border border-cyan-400">
            <span className="text-5xl">👨🏻</span>
          </div>
          <h2 className="text-2xl font-bold mt-4">Inicia Sesión</h2>
          <p className="text-sm text-cyan-400 mt-1">
            ¿Es tu primera vez?{" "}
            <a href="register" className="underline text-cyan-300">
              Regístrate
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-cyan-400 mb-1">Correo</label>
            <input
              type="email"
              name="email"
              placeholder="Ingresa tu correo"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-cyan-400 mb-1">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              value={form.contrasena}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="../recover-password" className="text-cyan-400 hover:underline">
              ¿Se te olvidó la contraseña?
            </a>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="recordar"
                checked={form.recordar}
                onChange={handleChange}
              />
              <label>Recordar mi sesión</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-semibold"
          >
            Ingresar
          </button>
        </form>

        <hr className="my-6 border-cyan-700" />

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center space-x-2 bg-cyan-500 py-2 rounded-lg hover:bg-cyan-600">
            <span>📧</span>
            <span>Inicia Sesión con Gmail</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-cyan-500 py-2 rounded-lg hover:bg-cyan-600">
            <span>🪟</span>
            <span>Inicia Sesión con Microsoft</span>
          </button>
        </div>
      </div>
    </div>
  );
}
