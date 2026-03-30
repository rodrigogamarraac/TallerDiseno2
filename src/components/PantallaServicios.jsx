export default function PantallaServicios({ servicios }) {
  return (
    <div>
      <h2>Servicios del hotel</h2>

      {servicios.length === 0 ? (
        <p className="mensaje-vacio">No hay contactos disponibles.</p>
      ) : (
        <div className="tarjetas-servicios">
          {servicios.map((s) => (
            <div key={s.id} className="tarjeta">
              <h3>{s.nombre}</h3>
              <p><strong>Encargado:</strong> {s.encargado}</p>
              <p><strong>Teléfono:</strong> {s.telefono}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}