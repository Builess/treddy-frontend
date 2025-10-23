import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-between bg-[#0F173A] text-white px-8 py-10 border-t border-[#1a1f40] pt-10 mt-10">
      {/* Sobre nosotros */}
      <section>
        <h2 className="font-bold mb-2">Sobre nosotros</h2>
        <ul className="space-y-1">
          <li>
            <Link href="/quienesSomos" className="hover:text-[#00E6F6]">
              Quienes somos
            </Link>
          </li>
          <li>
            <Link href="/terminosCondiciones" className="hover:text-[#00E6F6]">
              Términos y Condiciones
            </Link>
          </li>
          <li>
            <Link href="/politicasPrivacidad" className="hover:text-[#00E6F6]">
              Políticas de Privacidad
            </Link>
          </li>
        </ul>
      </section>

      {/* Navegación */}
      <section>
        <h2 className="font-bold mb-2">Navegación</h2>
        <ul className="space-y-1">
          <li>
            <Link href="/catalogo" className="hover:text-[#00E6F6]">
              Catálogo
            </Link>
          </li>
          <li>
            <Link href="/promociones" className="hover:text-[#00E6F6]">
              Promociones
            </Link>
          </li>
          <li>
            <Link href="/loMasVendido" className="hover:text-[#00E6F6]">
              Lo más vendido
            </Link>
          </li>
        </ul>
      </section>

      {/* Preguntas Frecuentes */}
      <section>
        <h2 className="font-bold mb-2">Preguntas Frecuentes</h2>
        <ul className="space-y-1">
          <li>
            <Link href="/faq#queEsAr" className="hover:text-[#00E6F6]">
              ¿Qué es el AR?
            </Link>
          </li>
          <li>
            <Link href="/faq#comoFuncionaAr" className="hover:text-[#00E6F6]">
              ¿Cómo funciona el AR?
            </Link>
          </li>
          <li>
            <Link href="/faq#preview3d" className="hover:text-[#00E6F6]">
              ¿Qué es la previsualización en 3D?
            </Link>
          </li>
        </ul>
      </section>

      {/* Contacto */}
      <section>
        <h2 className="font-bold mb-2">Contáctanos</h2>
        <ul className="space-y-1">
          <li>
            <Link href="/contacto#email" className="hover:text-[#00E6F6]">
              Correo:
            </Link>
          </li>
          <li>
            <Link href="/contacto#telefono" className="hover:text-[#00E6F6]">
              Teléfono:
            </Link>
          </li>
          <li>
            <Link href="/contacto#whatsapp" className="hover:text-[#00E6F6]">
              WhatsApp:
            </Link>
          </li>
        </ul>
      </section>
    </footer>
  );
}
