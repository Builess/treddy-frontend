/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getFiguras } from "../lib/api";
import Image from "next/image";
import Footer from "@/pages/footer";
import Nav from "@/pages/nav";

export default function HomePage() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? figuras.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === figuras.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <Nav />

      {/* HERO */}
      <section className="mx-8 flex flex-col md:flex-row justify-between items-center px-35 py-10 bg-[#0F173A]/20 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="max-w-xxl">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight">
            Treddy Figuras 3D
          </h2>
          <p className="mt-5 text-lg text-[#B5B8C5]">
            Personaliza o crea tu propia figura impresa en 3D
          </p>
          <button className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg">
            Inicia ahora
          </button>
        </div>

        {/* CARRUSEL */}
        {figuras.length > 0 && (
          <section className="w-200 bg-[#0F173A] rounded-lg shadow-md my-1 py-5">
            <div className="relative w-full overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {figuras.map((figura: any) => (
                  <div
                    key={figura.producto_id}
                    className="flex-shrink-0 w-full flex justify-center items-center p-6"
                  >
                    <div className="text-center">
                      <Image
                        src={figura.imagenUrl}
                        alt={figura.nombre}
                        width={250}
                        height={150}
                        className="mx-auto rounded-md"
                      />
                      <p className="mt-2 font-medium">{figura.nombre}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón anterior */}
              <button
                onClick={prevSlide}
                type="button"
                className="absolute inset-y-0 left-0 flex items-center justify-center w-12 h-full text-white hover:bg-white/10"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Botón siguiente */}
              <button
                onClick={nextSlide}
                type="button"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white hover:bg-white/10"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Dots de navegación */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                {figuras.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? "bg-[#00E6F6]" : "bg-gray-400"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </section>
        )}
      </section>

      {/* PRODUCTOS POPULARES */}
      <section className="px-8 py-16">
        <h3 className="text-3xl text-center font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-10">
          Productos Populares
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {figuras.map((figura: any, index: number) => (
            <div
              key={figura.producto_id}
              className={`bg-[#10193F] p-5 rounded-xl text-center shadow-lg hover:scale-105 hover:ring-2 hover:ring-cyan-400 transition-transform
              ${
                index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <Image
                src={figura.imagenUrl}
                alt={figura.nombre}
                width={index === 0 ? 450 : 140}
                height={index === 0 ? 250 : 140}
                className="mx-auto rounded-md"
              />
              <p className="mt-3 font-semibold text-lg">{figura.nombre}</p>
              <p className="font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight">{figura.precio_base}$</p>
              <button className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2 rounded-lg text-black font-medium hover:opacity-90">
                Ver más
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN AR */}
      <section className="mx-8 px-70 py-8 bg-[#0F173A] flex flex-col md:flex-row justify-between items-center  bg-[#0F173A]/20 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="max-w-xl">
          <h4 className="text-4xl font-bold mb-2 font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight">
            Visualiza tu imagen en realidad aumentada
          </h4>
          <p className="mt-5 text-lg text-[#B5B8C5]">
            Usa tu cámara para ver cómo se vería tu figura 3D en un espacio real
            antes de comprarla. ¡Haz tu compra con total confianza!
          </p>
          <button className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg">
            Pruébalo ahora
          </button>
        </div>
        <div className="mt-10 md:mt-0">
          <Image
            src="/treddy-sublogo.png"
            alt="Treddy Logo"
            width={450}
            height={250}
          />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
