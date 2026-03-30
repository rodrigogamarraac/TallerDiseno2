import { useState, useEffect } from "react";
import supabase from "../supabase";

export default function FormularioHuesped({ onGuardar }) {
  //const [listaHuespedes, setListaHuespedes] = useState([]);

  /*useEffect(() => {
    fetchHuespedes();
  }, []);

  const fetchHuespedes = async () => {
    const { data, error } = await supabase
      .from('huesped')
      .select("*")

      if(error){
        console.log('Error: ', error)
      }else{
        setListaHuespedes(data);
      }
  }*/
  const [formulario, setFormulario] = useState({
    nombreCompleto: "",
    tipoDocumento: "CI",
    numeroDocumento: "",
    telefono: "",
    correo: "",
    fechaNacimiento: "",
    nacionalidad: "",
  });

  function cambiar(e) {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  }

  const enviar = async (e) => {
    e.preventDefault();
    if (
      !formulario.nombreCompleto ||
      !formulario.numeroDocumento ||
      !formulario.telefono ||
      !formulario.correo
    ) {
      alert("Por favor llenat todas las casillas");
      return;
    }

    //if(formulario.numeroDocumento == )

    onGuardar(formulario);

    
    /*
    const nuevoHuesped = {
      nombre_completo: formulario.nombreCompleto,
      tipo_documento: formulario.tipoDocumento,
      numero_documento: formulario.numeroDocumento,
      telefono: formulario.telefono,
      correo: formulario.correo,
      fecha_nacimiento: formulario.fechaNacimiento,
      nacionalidad: formulario.nacionalidad
    }

    

    const { data, error } = await supabase
    .from('huesped')
    .insert([nuevoHuesped])
    .select()
    .single()

    console.log(nuevoHuesped);
    console.log(data);

    if(error){
      console.log('Error al cargar los datos del huesped:', error);
    }else{
      setListaHuespedes([data, ...listaHuespedes]);
    }*/

    setFormulario({
      nombreCompleto: "",
      tipoDocumento: "CI",
      numeroDocumento: "",
      telefono: "",
      correo: "",
      fechaNacimiento: "",
      nacionalidad: "",
    });
  }

  /*function enviar(e) {
    e.preventDefault();

    if (
      !formulario.nombreCompleto ||
      !formulario.numeroDocumento ||
      !formulario.telefono ||
      !formulario.correo
    ) {
      alert("Por favor llenat todas las casillas");
      return;
    }

    onGuardar(formulario);

    setFormulario({
      nombreCompleto: "",
      tipoDocumento: "CI",
      numeroDocumento: "",
      telefono: "",
      correo: "",
      fechaNacimiento: "",
      nacionalidad: "",
    });
  }*/

  return (
    <div>
      <h2>Registrar huésped</h2>

      <form className="formulario" onSubmit={enviar}>
        <div className="campo">
          <label>Nombre completo</label>
          <input
            name="nombreCompleto"
            value={formulario.nombreCompleto}
            onChange={cambiar}
          />
        </div>

        <div className="campo">
          <label>Tipo de documento</label>
          <select
            name="tipoDocumento"
            value={formulario.tipoDocumento}
            onChange={cambiar}
          >
            <option value="CI">CI</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>

        <div className="campo">
          <label>Número de documento</label>
          <input
            name="numeroDocumento"
            value={formulario.numeroDocumento}
            onChange={cambiar}
          />
        </div>

        <div className="campo">
          <label>Teléfono</label>
          <input
            name="telefono"
            value={formulario.telefono}
            onChange={cambiar}
          />
        </div>

        <div className="campo">
          <label>Correo</label>
          <input
            name="correo"
            value={formulario.correo}
            onChange={cambiar}
          />
        </div>

        <div className="campo">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formulario.fechaNacimiento}
            onChange={cambiar}
          />
        </div>

        <div className="campo">
          <label>Nacionalidad</label>
          <input
            name="nacionalidad"
            value={formulario.nacionalidad}
            onChange={cambiar}
          />
        </div>

        <button className="boton-principal" type="submit">
          Guardar huésped
        </button>
      </form>
      
    </div>
  );
}