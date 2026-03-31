function obtenerNombreHuesped(huespedes, id) {
  const huesped = huespedes.find((h) => h.id_huesped === id);
  return huesped ? huesped.nombreCompleto : "Sin huésped";
}

function obtenerNumeroHabitacion(habitaciones, id) {
  const habitacion = habitaciones.find((h) => h.id_habitacion === id);
  return habitacion ? habitacion.numero : "Sin habitación";
}

function obtenerTipoHabitacion(tipos, id) {
  const tipo = tipos.find((t) => t.id_tipo_habitacion === id);
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
    .filter((r) => r.fecha_salida >= hoy)
    .sort((a, b) => a.fecha_ingreso.localeCompare(b.fecha_ingreso));

  return (
    <div>
      <h2>Reservas activas y futuras</h2>

      {reservasVisibles.length === 0 ? (
        <p className="mensaje-vacio">No hay reservas disponibles.</p>
      ) : (
        <div className="lista">
          {reservasVisibles.map((r) => (
            <div key={r.id_reserva} className="item-lista">
              <div>
                <h3>{obtenerNombreHuesped(huespedes, r.id_huesped)}</h3>
                <p>Habitación: {obtenerNumeroHabitacion(habitaciones, r.id_habitacion)}</p>
                <p>Tipo: {obtenerTipoHabitacion(tipos, r.id_tipo_habitacion)}</p>
                <p>Ingreso: {r.fecha_ingreso}</p>
                <p>Salida: {r.fecha_salida}</p>
                <p>Personas: {r.cantidad_personas}</p>
              </div>

              <div>
                <span className="estado">{r.estado}</span>
                {r.hora_checkin && <p>Check-in: {r.hora_checkin}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}