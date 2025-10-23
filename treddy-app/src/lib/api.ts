export async function getFiguras() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/figuras`);
  if (!res.ok) throw new Error("Error al obtener las figuras");
  return res.json();
}



export async function registerUser(data: {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
}) {
  const res = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error en el registro");
  return res.json();
}

export async function loginUser(data: { email: string; contrasena: string }) {
  const res = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
}
