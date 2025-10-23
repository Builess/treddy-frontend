'use client';

import { useProductos, Producto } from "@/context/ProductosContext";
import Image from "next/image";
import Nav from "@/pages/nav";
import Footer from "@/pages/footer";

export default function InterfazGestion() {
  const { historial } = useProductos();
  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <Nav />
      <section className="px-8 py-16">
        {/* Historial de cambios */}
        <h1 className="text-4xl font-bold mb-8 text-center">Historial de cambios</h1>
        <div className="bg-[#0F173A] p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
          {historial.length === 0 && <p className="text-gray-400 text-center">No hay cambios registrados</p>}
          <ul>
            {historial.map(log => (
              <li key={log.id} className="border-b border-gray-600 py-2">
                <p>
                  <span className="font-semibold">{log.tipo}</span> - <span>{log.producto.nombre}</span> (${log.producto.precio.toFixed(2)})
                </p>
                <p className="text-gray-400 text-sm">{log.fecha}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}
