export default function Inicio({ huespedes, reservas, servicios }) {
  const reservasEnCurso = reservas.filter((r) => r.estado === "En curso").length;

  return (
    <div>
      <h2>Panel principal</h2>
      <p>Prototipo simple del sistema de reservas del hotel.</p>

      <div className="tarjetas-resumen">
        <div className="tarjeta">
          <h3>Huéspedes</h3>
          <p>{huespedes.length}</p>
        </div>

        <div className="tarjeta">
          <h3>Reservas</h3>
          <p>{reservas.length}</p>
        </div>

        <div className="tarjeta">
          <h3>En curso</h3>
          <p>{reservasEnCurso}</p>
        </div>

        <div className="tarjeta">
          <h3>Servicios</h3>
          <p>{servicios.length}</p>
        </div>
      </div>
    </div>
  );
}