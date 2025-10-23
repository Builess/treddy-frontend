'use client';

import { ReactNode } from "react";
import { ProductosProvider } from "@/context/ProductosContext";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <ProductosProvider>{children}</ProductosProvider>;
}
