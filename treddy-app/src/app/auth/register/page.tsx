"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/animatedBackground";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
    aceptar: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.aceptar) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    if (form.contrasena !== form.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          email: form.email,
          contrasena: form.contrasena,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error en el registro");
        return;
      }

      const data = await response.json();
      console.log("Usuario registrado:", data);

      alert("Registro exitoso, ahora puedes iniciar sesión");
      router.push("/login");
    } catch (error) {
      console.error("Error en fetch:", error);
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* Fondo animado */}
      <AnimatedBackground />

      {/* Contenedor principal */}
      <div className="relative bg-[#0f1c2b] text-white p-10 rounded-2xl shadow-lg w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full flex justify-center items-center border border-cyan-400">
            <span className="text-5xl">🐻</span>
          </div>
          <h2 className="text-2xl font-bold mt-4">Regístrate</h2>
          <p className="text-sm text-cyan-400 mt-1">
            ¿Ya tienes una cuenta?{" "}
            <a href="login" className="underline text-cyan-300">
              Inicia Sesión
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
            <input
              type="password"
              name="confirmarContrasena"
              placeholder="Confirmar Contraseña"
              value={form.confirmarContrasena}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="aceptar"
              checked={form.aceptar}
              onChange={handleChange}
            />
            <label className="text-sm">Aceptar términos y condiciones</label>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-semibold"
          >
            Registrarse
          </button>
        </form>

        <hr className="my-6 border-cyan-700" />

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center space-x-2 bg-cyan-500 py-2 rounded-lg hover:bg-cyan-600">
            <span>📧</span>
            <span>Regístrate con Gmail</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-cyan-500 py-2 rounded-lg hover:bg-cyan-600">
            <span>🪟</span>
            <span>Regístrate con Microsoft</span>
          </button>
        </div>
      </div>
    </div>
  );
}
