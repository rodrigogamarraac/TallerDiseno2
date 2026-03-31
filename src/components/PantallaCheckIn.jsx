function obtenerNombreHuesped(huespedes, id) {
  const huesped = huespedes.find((h) => h.id === id);
  return huesped ? huesped.nombreCompleto : "Sin huésped";
}

function obtenerNumeroHabitacion(habitaciones, id) {
  const habitacion = habitaciones.find((h) => h.id === id);
  return habitacion ? habitacion.numero : "Sin habitación";
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
            <div key={r.id} className="item-lista">
              <div>
                <h3>{obtenerNombreHuesped(huespedes, r.huespedId)}</h3>
                <p>Habitación: {obtenerNumeroHabitacion(habitaciones, r.habitacionId)}</p>
                <p>Ingreso: {r.fechaIngreso}</p>
                <p>Salida: {r.fechaSalida}</p>
              </div>

              <button
                className="boton-principal"
                onClick={() => onCheckIn(r.id)}
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