import Link from "next/link";

export default function Nav() {
  return (
    <header className="flex justify-between items-center px-8 py-6 bg-[#0A0F2C] border-b border-[#1a1f40] mb-10">
      <h1 className="text-2xl font-bold text-[#00E6F6]">TREDDY</h1>
      <nav className="space-x-6">
        <Link href="/../" className="hover:text-[#00E6F6]">
          Inicio
        </Link>
        <Link href="/../catalogo" className="hover:text-[#00E6F6]">
          Catalogo
        </Link>
        <Link href="/../personalizacion" className="hover:text-[#00E6F6]">
          Personalizar
        </Link>
        <Link href="/../" className="hover:text-[#00E6F6]">
          Contacto
        </Link>
      </nav>
      <div className="space-x-4">
        <Link href="/../carrito-compras" className="hover:text-[#00E6F6]">
          Carrito
        </Link>
        <Link href="/../perfil" className="hover:text-[#00E6F6]">
          Perfil
        </Link>
      </div>
    </header>
  );
}
