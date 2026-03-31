import { useState, useEffect } from "react";
import "./App.css";

import supabase from "./supabase";

import Sidebar from "./components/Sidebar";
import Inicio from "./components/Inicio";
import FormularioHuesped from "./components/FormularioHuesped";
import FormularioReserva from "./components/FormularioReserva";
import ListaReservas from "./components/ListaReservas";
import PantallaCheckIn from "./components/PantallaCheckIn";
import PantallaServicios from "./components/PantallaServicios";
import PantallaConsultarHuesped from "./components/PantallaConsultarHuesped";

export default function App() {

  //const [listaHuespedes, setListaHuespedes] = useState([]);
  const [vista, setVista] = useState("inicio");

  const [tipos, setTipos] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [servicios, setServicios] = useState(/*serviciosIniciales*/[]);
  const [huespedes, setHuespedes] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    fetchHuespedes();
    fetchTipos();
    fetchHabitaciones();
    fetchReservas();
    fetchServicios();
  }, []);

  const fetchHuespedes = async () => {
    const { data, error } = await supabase
      .from('huesped')
      .select("*")

      if(error){
        console.log('Error: ', error)
      }else{
        setHuespedes(data/*, ...huespedes*/);
      }
  }

  const fetchTipos = async () => {
    const { data, error } = await supabase
      .from('tipo_habitacion')
      .select("*")

      if(error){
        console.log('Error: ', error)
      }else{
        setTipos(data/*, ...tipos*/);
        console.log('Tipos de habitación cargados:', data);
      }
  }

  const fetchHabitaciones = async () => {
    const { data, error } = await supabase
      .from('habitacion')
      .select("*")

      if(error){
        console.log('Error: ', error)
      }else{
        setHabitaciones(/*[...*/data/*, ...habitaciones]*/);
        console.log('Habitaciones cargadas:', data);
      }
  }

  const fetchReservas = async () => {
    const { data, error } = await supabase
      .from('reserva')
      .select("*")

      if(error){
        console.log('Error: ', error)
      }else{
        setReservas(data);
        console.log('Reservas cargadas:', data);
      }
  }

  const fetchServicios = async () => {
    const { data, error } = await supabase
      .from('servicio')
      .select('*')

      if(error){
        console.log('Error: ', error)
      }else{
        setServicios(data);
        console.log('Servicios cargados:', data);
      }
  }
  
  
  const registrarHuesped = async (nuevoHuesped) => {
    const duplicado = huespedes.some(
      (h) => h.numero_documento === nuevoHuesped.numeroDocumento
    );

    if (duplicado) {
      alert("Ya existe un huésped con ese documento.");
      return;
    }

    /*
    const nuevo = {
      id: Date.now(),
      ...nuevoHuesped,
    };*/

    const datosHuesped = {
      nombre_completo: nuevoHuesped.nombreCompleto,
      tipo_documento: nuevoHuesped.tipoDocumento,
      numero_documento: nuevoHuesped.numeroDocumento,
      telefono: nuevoHuesped.telefono,
      correo: nuevoHuesped.correo,
      fecha_nacimiento: nuevoHuesped.fechaNacimiento,
      nacionalidad: nuevoHuesped.nacionalidad
    }

    const { data, error } = await supabase
    .from('huesped')
    .insert([datosHuesped])
    .select()
    .single()

    console.log(datosHuesped);
    console.log(data);

    if(error){
      console.log('Error al cargar los datos del huesped:', error);
      alert("Error al registrar el huésped.");
    }else{
      setHuespedes([data, ...huespedes]);
      alert("Huésped registrado correctamente.");
    }

    // setHuespedes([...huespedes/*, nuevo*/]);
    //alert("Huésped registrado correctamente.");
    //setVista("consultarHuesped");
  }

  const crearReserva = async(nuevaReserva) =>{

    const tipo = tipos.find((t) => t.id_tipo_habitacion === nuevaReserva.tipoHabitacionId);

    if (nuevaReserva.fechaSalida <= nuevaReserva.fechaIngreso) {
      alert("La fecha de salida debe ser posterior a la fecha de ingreso.");
      return;
    }

    if (nuevaReserva.cantidadPersonas > tipo.capacidad) {
      alert("La cantidad de personas supera la capacidad de la habitación.");
      return;
    }

    const haySolapamiento = reservas.some((r) => {
      if (r.id_habitacion !== nuevaReserva.habitacionId) return false;
      if (r.estado === "Cancelada") return false;

      return (
        nuevaReserva.fechaIngreso < r.fecha_salida &&
        nuevaReserva.fechaSalida > r.fecha_ingreso
      );
    });

    if (haySolapamiento) {
      alert("La habitación ya está reservada en ese rango de fechas.");
      return;
    }

    /*const nueva = {
      id: Date.now(),
      ...nuevaReserva,
      estado: "Reservada",
      horaCheckIn: "",
    };*/

    const datosReserva = {
      fecha_ingreso: nuevaReserva.fechaIngreso,
      fecha_salida: nuevaReserva.fechaSalida,
      cantidad_personas: nuevaReserva.cantidadPersonas,
      estado: "Reservada",
      hora_checkin: null,
      hora_checkout: null,
      id_habitacion: nuevaReserva.habitacionId,
      id_tipo_habitacion: nuevaReserva.tipoHabitacionId,
      // id_checkin: null,
      id_huesped_titular: nuevaReserva.huespedId
    }

    const { data, error } = await supabase
    .from('reserva')
    .insert([datosReserva])
    .select()
    .single()

    console.log(datosReserva);
    console.log(data);

    if(error){
      console.log('Error al cargar los datos de la reserva:', error);
      alert("Error al registrar la reserva.");
    }else{
      setReservas([data, ...reservas]);
      alert("Reserva registrada correctamente.");
    }

    // setReservas([...reservas, nueva]);
    // alert("Reserva registrada correctamente.");
    setVista("reservas");
  }

  const registrarCheckIn = async(idReserva) => {
    const reserva = reservas.find((r) => r.id_reserva === idReserva);

    if (!reserva) {
      alert("Reserva no encontrada.");
      return;
    }

    if (reserva.estado === "Cancelada") {
      alert("No se puede hacer check-in a una reserva cancelada.");
      return;
    }

    if (reserva.hora_checkin) {
      alert("La reserva ya tiene check-in registrado.");
      return;
    }

    /*const actualizadas = reservas.map((r) =>
      r.id_reserva === idReserva
        ? {
            ...r,
            hora_checkin: new Date().toLocaleString(),
            estado: "En curso",
          }
        : r
    );*/

    const { data, error } = await supabase
      .from('reserva')
      .update({ hora_checkin: new Date().toISOString(), estado: "En curso" })
      .eq('id_reserva', idReserva)
      .select()
      .single();

    if(error){
      console.log('Error al hacer checkin:', error);
      alert("Error al hacer checkin.");
      return;
    }

    const actualizadas = reservas.map((r) =>
      r.id_reserva === idReserva ? data : r
    );

    setReservas(actualizadas);
    alert("Check-in registrado correctamente.");
    setVista("reservas");
  }

  function renderVista() {
    switch (vista) {
      case "inicio":
        return (
          <Inicio
            huespedes={huespedes}
            reservas={reservas}
            servicios={servicios}
          />
        );

      case "registrarHuesped":
        return <FormularioHuesped onGuardar={registrarHuesped} />;

      case "crearReserva":
        return (
          <FormularioReserva
            huespedes={huespedes}
            tipos={tipos}
            habitaciones={habitaciones}
            onGuardar={crearReserva}
          />
        );

      case "reservas":
        return (
          <ListaReservas
            reservas={reservas}
            huespedes={huespedes}
            habitaciones={habitaciones}
            tipos={tipos}
          />
        );

      case "checkin":
        return (
          <PantallaCheckIn
            reservas={reservas}
            huespedes={huespedes}
            habitaciones={habitaciones}
            onCheckIn={registrarCheckIn}
          />
        );

      case "servicios":
        return <PantallaServicios servicios={servicios} />;

      case "consultarHuesped":
        return <PantallaConsultarHuesped huespedes={huespedes} />;

      default:
        return (
          <Inicio
            huespedes={huespedes}
            reservas={reservas}
            servicios={servicios}
          />
        );
    }
  }

  return (
    <div className="app">
      <Sidebar setVista={setVista} />
      <main className="contenido">{renderVista()}</main>
    </div>
  );
}