'use client';

import { useState } from 'react';
import Image from 'next/image';
import Nav from "@/pages/nav";
import Footer from "@/pages/footer";
import { useProductos, Producto } from "@/context/ProductosContext";

export default function ProductManagementPreview() {
  const { productos, setProductos, agregarLog } = useProductos();

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    imagenUrl: '',
    categorias: '',
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  const guardarProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;

    const productoData: Producto = {
      id: editandoId || Date.now(),
      nombre: nuevoProducto.nombre,
      precio: parseFloat(nuevoProducto.precio),
      imagenUrl: nuevoProducto.imagenUrl || '/treddy-sublogo.png',
      categorias: nuevoProducto.categorias
        ? nuevoProducto.categorias.split(',').map((c) => c.trim())
        : [],
    };

    if (editandoId) {
      // Editar producto
      setProductos(productos.map((p) => (p.id === editandoId ? productoData : p)));

      // Registrar edición
      agregarLog({
        id: Date.now(),
        tipo: 'Editar',
        producto: productoData,
        fecha: new Date().toLocaleString(),
      });

      setEditandoId(null);
    } else {
      // Agregar producto
      setProductos([...productos, productoData]);

      // Registrar agregado
      agregarLog({
        id: Date.now(),
        tipo: 'Agregar',
        producto: productoData,
        fecha: new Date().toLocaleString(),
      });
    }

    setNuevoProducto({ nombre: '', precio: '', imagenUrl: '', categorias: '' });
  };

  const eliminarProducto = (id: number) => {
    const prodEliminar = productos.find((p) => p.id === id);
    if (!prodEliminar) return;

    setProductos(productos.filter((p) => p.id !== id));

    // Registrar eliminación
    agregarLog({
      id: Date.now(),
      tipo: 'Eliminar',
      producto: prodEliminar,
      fecha: new Date().toLocaleString(),
    });

    if (editandoId === id) {
      setEditandoId(null);
      setNuevoProducto({ nombre: '', precio: '', imagenUrl: '', categorias: '' });
    }
  };

  const editarProducto = (id: number) => {
    const p = productos.find((prod) => prod.id === id);
    if (!p) return;

    setNuevoProducto({
      nombre: p.nombre,
      precio: p.precio.toString(),
      imagenUrl: p.imagenUrl,
      categorias: p.categorias ? p.categorias.join(', ') : '',
    });
    setEditandoId(id);
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <Nav />

      <section className="px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulario */}
        <div className="bg-[#0F173A] p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{editandoId ? "Editar producto" : "Agregar producto"}</h2>

          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            className="w-full mb-3 p-2 rounded bg-[#10193F] border border-gray-600 text-white"
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            className="w-full mb-3 p-2 rounded bg-[#10193F] border border-gray-600 text-white"
          />
          <input
            type="text"
            placeholder="URL de imagen"
            value={nuevoProducto.imagenUrl}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagenUrl: e.target.value })}
            className="w-full mb-3 p-2 rounded bg-[#10193F] border border-gray-600 text-white"
          />
          <input
            type="text"
            placeholder="Categorías (separadas por comas)"
            value={nuevoProducto.categorias}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, categorias: e.target.value })}
            className="w-full mb-3 p-2 rounded bg-[#10193F] border border-gray-600 text-white"
          />

          <button
            onClick={guardarProducto}
            className="bg-[#00E6F6] text-black px-6 py-2 rounded-full hover:bg-[#00c8d4] font-medium"
          >
            {editandoId ? "Guardar cambios" : "Agregar"}
          </button>
        </div>

        {/* Vista previa de productos */}
        <div className="overflow-y-auto max-h-[600px]">
          <h2 className="text-2xl font-semibold mb-4 text-center">Vista Previa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productos.map((p) => (
              <div
                key={p.id}
                className="bg-[#10193F] p-5 rounded-xl text-center shadow-lg hover:scale-105 transition-transform"
              >
                <Image src={p.imagenUrl} alt={p.nombre} width={120} height={120} className="mx-auto" />
                <p className="mt-3 font-semibold">{p.nombre}</p>
                <p className="text-cyan-400">${p.precio.toFixed(2)}</p>
                {p.categorias && <p className="text-gray-400 text-sm mt-1">{p.categorias.join(", ")}</p>}
                <div className="flex justify-center gap-2 mt-3">
                  <button
                    onClick={() => editarProducto(p.id)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1 rounded-lg text-black font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(p.id)}
                    className="bg-gradient-to-r from-pink-500 to-red-500 px-4 py-1 rounded-lg text-black font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
