function obtenerNombreHuesped(huespedes, id) {
  const huesped = huespedes.find((h) => h.id === id);
  return huesped ? huesped.nombreCompleto : "Sin huésped";
}

function obtenerNumeroHabitacion(habitaciones, id) {
  const habitacion = habitaciones.find((h) => h.id === id);
  return habitacion ? habitacion.numero : "Sin habitación";
}

function obtenerTipoHabitacion(tipos, id) {
  const tipo = tipos.find((t) => t.id === id);
  return tipo ? tipo.nombre : "Sin tipo";
}

export default function ListaReservas({
  reservas,
  huespedes,
  habitaciones,
  tipos,
}) {
  const hoy = new Date().toISOString().split("T")[0];

  const reservasVisibles = reservas
    .filter((r) => r.fechaSalida >= hoy)
    .sort((a, b) => a.fechaIngreso.localeCompare(b.fechaIngreso));

  return (
    <div>
      <h2>Reservas activas y futuras</h2>

      {reservasVisibles.length === 0 ? (
        <p className="mensaje-vacio">No hay reservas disponibles.</p>
      ) : (
        <div className="lista">
          {reservasVisibles.map((r) => (
            <div key={r.id} className="item-lista">
              <div>
                <h3>{obtenerNombreHuesped(huespedes, r.huespedId)}</h3>
                <p>Habitación: {obtenerNumeroHabitacion(habitaciones, r.habitacionId)}</p>
                <p>Tipo: {obtenerTipoHabitacion(tipos, r.tipoHabitacionId)}</p>
                <p>Ingreso: {r.fechaIngreso}</p>
                <p>Salida: {r.fechaSalida}</p>
                <p>Personas: {r.cantidadPersonas}</p>
              </div>

              <div>
                <span className="estado">{r.estado}</span>
                {r.horaCheckIn && <p>Check-in: {r.horaCheckIn}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}