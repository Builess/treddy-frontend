// src/context/ProductosContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from "react";

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  categorias?: string[];
}

export interface LogCambio {
  id: number;
  tipo: 'Agregar' | 'Editar' | 'Eliminar';
  producto: Producto;
  fecha: string;
}

interface ProductosContextType {
  productos: Producto[];
  setProductos: (productos: Producto[]) => void;
  historial: LogCambio[];
  agregarLog: (log: LogCambio) => void;
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [historial, setHistorial] = useState<LogCambio[]>([]);

  const agregarLog = (log: LogCambio) => setHistorial(prev => [log, ...prev]);

  return (
    <ProductosContext.Provider value={{ productos, setProductos, historial, agregarLog }}>
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductos = () => {
  const context = useContext(ProductosContext);
  if (!context) throw new Error("useProductos debe usarse dentro de ProductosProvider");
  return context;
};
