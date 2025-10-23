"use client";

import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#0A0F2C] to-[#0F173A] text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#10193F] p-10 rounded-2xl shadow-lg max-w-md w-full text-center"
      >
        {/* Icono grande */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.3 }}
        >
          <CheckCircleIcon className="w-20 h-20 text-green-400 mx-auto" />
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          ¡Pago Exitoso!
        </motion.h1>

        {/* Mensaje */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-3 text-gray-300"
        >
          Tu pago fue aprobado correctamente. Gracias por confiar en Treddy 🚀
        </motion.p>

        {/* Botón */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Link
            href="/"
            className="mt-6 inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition"
          >
            Volver al inicio
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
