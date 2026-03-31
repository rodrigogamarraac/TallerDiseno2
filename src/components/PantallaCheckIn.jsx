function obtenerNombreHuesped(huespedes, id) {
  const huesped = huespedes.find((h) => h.id_huesped === id);
  return huesped ? huesped.nombre_completo : "Sin huésped";
}

function obtenerNumeroHabitacion(habitaciones, id) {
  const habitacion = habitaciones.find((h) => h.id_habitacion === id);
  return habitacion ? habitacion.numero_habitacion : "Sin habitación";
}

export default function PantallaCheckIn({
  reservas,
  huespedes,
  habitaciones,
  onCheckIn,
}) {
  const disponibles = reservas.filter(
    (r) => r.estado !== "Cancelada" && !r.hora_checkin
  );

  return (
    <div>
      <h2>Registrar check-in</h2>

      {disponibles.length === 0 ? (
        <p className="mensaje-vacio">No hay reservas pendientes de check-in.</p>
      ) : (
        <div className="lista">
          {disponibles.map((r) => (
            <div key={r.id_reserva} className="item-lista">
              <div>
                <h3>{obtenerNombreHuesped(huespedes, r.id_huesped_titular)}</h3>
                <p>Habitación: {obtenerNumeroHabitacion(habitaciones, r.id_habitacion)}</p>
                <p>Ingreso: {r.fecha_ingreso}</p>
                <p>Salida: {r.fecha_salida}</p>
              </div>

              <button
                className="boton-principal"
                onClick={() => onCheckIn(r.id_reserva)}
              >
                Hacer check-in
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}