'use client'
import Image from 'next/image'
import { useState } from 'react'
import ARViewer from '@/components/vistaAR'

type Figura = {
  producto_id: number
  nombre: string
  imagenUrl: string
  precio_base: number
  descripcion: string
  stock: number
}

export default function TarjetaExpandible({ figura, onClose }: { figura: Figura, onClose: () => void }) {
  const [mostrarAR, setMostrarAR] = useState(false)

  if (!figura) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#0F173A] p-6 rounded-xl max-w-6xl w-full flex gap-6 text-white relative">
        
        {/* Columna izquierda: imagen + info */}
        <div className="flex-[1] text-center relative">
          <button
            onClick={() => setMostrarAR(!mostrarAR)}
            className="absolute top-3 left-3 bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#00E6F6] hover:text-black transition"
          >
            {mostrarAR ? 'Cerrar AR' : 'AR'}
          </button>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white py-2 px-4 rounded-lg hover:text-[#00E6F6]"
          >
            X
          </button>

          <p className="text-[#00E6F6] font-bold mt-1">Disponible: {figura.stock}</p>

          <Image
            src={figura.imagenUrl || "/placeholder.png"}
            alt={figura.nombre}
            width={350}
            height={400}
            className="mx-auto mb-4 rounded-lg"
          />

          <h2 className="text-2xl font-bold mb-2">{figura.nombre}</h2>
          <p className="text-[#00E6F6] font-bold mb-2">${figura.precio_base}</p>
          <p className="text-gray-300 mb-4">{figura.descripcion}</p>

          <div className="flex flex-col gap-2">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg">
              Comprar
            </button>
            <button className="bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-[#00E6F6] hover:text-black transition">
              Personalizar
            </button>
            <button className="bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-[#00E6F6] hover:text-black transition">
              Enviar a carrito de compras
            </button>
          </div>
        </div>

        {/* Columna derecha: visor AR más grande */}
        {mostrarAR && (
          <div className="flex-[2] flex items-center justify-center rounded-lg bg-black/20">
            <ARViewer />
          </div>
        )}
      </div>
    </div>
  )
}
