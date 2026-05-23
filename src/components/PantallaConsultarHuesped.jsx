import { useState } from "react";
//import supabase from "../supabase";

export default function PantallaConsultarHuesped({ huespedes, reservas, tipos }) {
  const [seleccionado, setSeleccionado] = useState(null);

  return (
    <div className="lista">
      <h2>Ver huéspedes</h2>

      {huespedes.length === 0 ? (
        <p className="mensaje-vacio">No hay huéspedes registrados.</p>
      ) : (
        huespedes.map((huesped) => (
          <div key={huesped.id_huesped}> 
            <div className="item-lista">
              <div>
                <h3>Nombre: {huesped.nombre_completo}</h3>
                <p>Documento: {huesped.numero_documento}</p>
              </div>
              <button 
                className="boton-principal" 
                onClick={() => setSeleccionado(seleccionado?.id_huesped === huesped.id_huesped ? null : huesped)}
              >
                {seleccionado?.id_huesped === huesped.id_huesped ? "Cerrar" : "Ver información"}
              </button>
            </div>

            {seleccionado?.id_huesped === huesped.id_huesped && (
              <div className="detalle" style={{ marginTop: '10px', marginLeft: '20px' }}>
                <h3>Información del huésped</h3>
                <p><strong>Nombre:</strong> {seleccionado.nombre_completo}</p>
                <p><strong>Tipo de documento:</strong> {seleccionado.tipo_documento}</p>
                <p><strong>Número de documento:</strong> {seleccionado.numero_documento}</p>
                <p><strong>Teléfono:</strong> {seleccionado.telefono}</p>
                <p><strong>Correo:</strong> {seleccionado.correo}</p>
                <p><strong>Fecha de nacimiento:</strong> {seleccionado.fecha_nacimiento}</p>
                <p><strong>Nacionalidad:</strong> {seleccionado.nacionalidad}</p>
                {
                  reservas.filter(r => r.id_huesped_titular === seleccionado.id_huesped).length > 0 && (
                    <>
                      <h4>Reservas del huésped:</h4>
                      {reservas.filter(r => r.id_huesped_titular === seleccionado.id_huesped).map((reserva) => (
                        <p key={reserva.id_reserva}>
                          <strong>Fecha de ingreso:</strong> {reserva.fecha_ingreso} <br />
                          <strong>Fecha de salida:</strong> {reserva.fecha_salida} <br />
                          
                          <strong>Nombre habitacion: </strong> {tipos.filter(t => t.id_tipo_habitacion === reserva.id_tipo_habitacion).map(t => t.nombre)}
                        </p>
                        
                      ))}
                    </>
                  )

                }
                {/* <p><strong>Reserva</strong></p> */}
              </div>
            )}
            
          </div>
        ))
      )}
    </div>
  );
}