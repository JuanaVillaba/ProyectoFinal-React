let usuarios: any[] = [];

export function registrarUsuario(
email: string,
password: string,
departamento: string
) {
  // validar datos
if (!email || !password || !departamento) {
    return { error: 'Faltan datos' };
}

  // validar usuario repetido
const existe = usuarios.find((u) => u.email === email);

if (existe) {
    return { error: 'El usuario ya existe' };
}

  // guardar usuario
const nuevoUsuario = {
    email,
    password,
    departamento,
};

usuarios.push(nuevoUsuario);

return nuevoUsuario;
}