/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getFiguras } from "../../lib/api";
import Image from "next/image";
import Nav from "@/pages/nav";
import Footer from "@/pages/footer";


export default function Carrito() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const total = figuras.reduce(
    (suma: number, figura: any) => suma + Number(figura.precio_base),
    0
  );

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const btn = document.getElementById("checkout-button");
      if (!btn) return;

      const handleClick = async () => {
        try {
          const res = await fetch(
            `https://4ac7b7a2a950.ngrok-free.app/api/payment/create_preference`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: figuras.map((figura: any) => ({
                  id: figura.producto_id,
                  title: figura.nombre,
                  quantity: 1,
                  currency_id: "COP",
                  unit_price: Number(figura.precio_base),
                })),
              }),
            }
          );

          if (!res.ok) throw new Error("Error en backend");

          const data = await res.json();
          console.log("Preferencia creada:", data);

          const mp = new (window as any).MercadoPago(
            process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
            { locale: "es-CO" }
          );

          mp.checkout({
            preference: { id: data.id },
            autoOpen: true,
          });
        } catch (error) {
          console.error("Error en fetch o checkout:", error);
        }
      };

      btn.addEventListener("click", handleClick);
      return () => btn.removeEventListener("click", handleClick);
    };

    return () => {
      document.body.removeChild(script);
    };
  });

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
      {/* NAVBAR */}
      <Nav />

      <div className="flex-grow flex flex-col items-center justify-center px-4 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Tu carrito</h2>

        <div className="bg-[#0F173A] w-full max-w-md rounded-2xl shadow-lg p-8 py-10 mb-10">
          {figuras.length === 0 ? (
            <p className="text-center text-[#B5B8C5]">Tu carrito está vacío.</p>
          ) : (
            <>
              <div className="space-y-4">
                {figuras.map((figura: any) => (
                  <div
                    key={figura.producto_id}
                    className="flex justify-between items-center bg-[#1a214f] p-3 rounded-lg"
                  >
                    <Image
                      src={figura.imagenUrl}
                      alt={figura.nombre}
                      width={70}
                      height={70}
                    />
                    <p>{figura.nombre}</p>
                    <span>${figura.precio_base}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>

              {/* Botón conectado al checkout */}
              <button
                id="checkout-button"
                className="mt-6 w-full bg-[#00E6F6] text-black py-2 rounded-full font-medium hover:bg-[#00c8d4]"
              >
                Proceder al pago
              </button>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
