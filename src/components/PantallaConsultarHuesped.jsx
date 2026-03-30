import { useState, useEffect } from "react";
import supabase from "../supabase";

export default function PantallaConsultarHuesped({ huespedes }) {
  /*const [listaHuespedes, setListaHuespedes] = useState([]);

  useEffect(() => {
    fetchHuespedes();
  }, []);

  const fetchHuespedes = async () => {
    const { data, error } = await supabase
      .from('huesped')
      .select("*")

      if(error){
        console.log('Error: ', error)
      }else{
        setListaHuespedes([data, ...listaHuespedes]);
      }
  }*/

  return(
    <div className="lista">
      <h2>Ver huespedes</h2>
        
          
        {huespedes.map(huespedes => (
          <div key = {huespedes.id} className="item-lista">
            <div>
              <h3>Nombre: {huespedes.nombre_completo}</h3>
              <p>Documento: {huespedes.numero_documento}</p>
            </div>
            <button className="boton-principal">
              Ver información
            </button>
          </div>
        ))
        }
    </div>
  )

  /*const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  const filtrados = huespedes.filter((h) => {
    const texto = busqueda.toLowerCase();
    return (
      h.nombreCompleto.toLowerCase().includes(texto) ||
      h.numeroDocumento.toLowerCase().includes(texto)
    );
  });

  return (
    <div>
      <h2>Consultar huésped</h2>

      <div className="campo">
        <label>Buscar por nombre o documento</label>
        <input
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setSeleccionado(null);
          }}
          placeholder="Ejemplo: Carlos o 1234567"
        />
      </div>

      {busqueda && filtrados.length === 0 && (
        <p className="mensaje-vacio">No se encontraron resultados.</p>
      )}

      {!seleccionado && filtrados.length > 0 && (
        <div className="lista">
          {filtrados.map((h) => (
            <div key={h.id} className="item-lista">
              <div>
                <h3>{h.nombreCompleto}</h3>
                <p>Documento: {h.numeroDocumento}</p>
              </div>

              <button
                className="boton-principal"
                onClick={() => setSeleccionado(h)}
              >
                Ver información
              </button>
            </div>
          ))}
        </div>
      )}

      {seleccionado && (
        <div className="detalle">
          <h3>Información del huésped</h3>
          <p><strong>Nombre:</strong> {seleccionado.nombreCompleto}</p>
          <p><strong>Tipo de documento:</strong> {seleccionado.tipoDocumento}</p>
          <p><strong>Número de documento:</strong> {seleccionado.numeroDocumento}</p>
          <p><strong>Teléfono:</strong> {seleccionado.telefono}</p>
          <p><strong>Correo:</strong> {seleccionado.correo}</p>
          <p><strong>Fecha de nacimiento:</strong> {seleccionado.fechaNacimiento}</p>
          <p><strong>Nacionalidad:</strong> {seleccionado.nacionalidad}</p>

          <button
            className="boton-secundario"
            onClick={() => setSeleccionado(null)}
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );*/
}