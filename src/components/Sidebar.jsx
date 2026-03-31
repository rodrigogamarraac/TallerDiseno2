export default function Sidebar({ setVista }) {
  return (
    <aside className="sidebar">
      <h1>Hotel UCB</h1>

      <button onClick={() => setVista("inicio")}>Inicio</button>
      <button onClick={() => setVista("registrarHuesped")}>Registrar huesped</button>
      <button onClick={() => setVista("crearReserva")}>Crear reserva</button>
      <button onClick={() => setVista("reservas")}>Reservas</button>
      <button onClick={() => setVista("checkin")}>Registrar check-in</button>
      <button onClick={() => setVista("servicios")}>Servicios</button>
      <button onClick={() => setVista("consultarHuesped")}>Ver huespedes</button>
    </aside>
  );
}