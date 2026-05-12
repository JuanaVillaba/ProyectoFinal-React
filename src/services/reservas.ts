let reservas: any[] = [];

export function crearReserva(fecha: string, espacio: string) {
  // validar datos
if (!fecha || !espacio) {
    return { error: 'Faltan datos' };
}

  // evitar conflictos
const conflicto = reservas.find(r =>
    r.fecha === fecha && r.espacio === espacio
);

if (conflicto) {
    return { error: 'Ese espacio ya esta reservado en esa fecha' };
}

  // crear reserva
const nueva = { fecha, espacio };
reservas.push(nueva);

return nueva;
}