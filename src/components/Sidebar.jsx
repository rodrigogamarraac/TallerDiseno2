export default function Sidebar({ setVista }) {
  return (
    <aside className="sidebar">
      <h1>HotelApp</h1>
      <p className="subtitulo">Sistema de reservas</p>

      <button onClick={() => setVista("inicio")}>Inicio</button>
      <button onClick={() => setVista("registrarHuesped")}>Registrar huésped</button>
      <button onClick={() => setVista("crearReserva")}>Crear reserva</button>
      <button onClick={() => setVista("reservas")}>Reservas</button>
      <button onClick={() => setVista("checkin")}>Registrar check-in</button>
      <button onClick={() => setVista("servicios")}>Servicios</button>
      <button onClick={() => setVista("consultarHuesped")}>Consultar huésped</button>
    </aside>
  );
}