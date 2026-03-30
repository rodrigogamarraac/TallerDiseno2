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

import {
  tiposIniciales,
  habitacionesIniciales,
  serviciosIniciales,
  //huespedesIniciales,
  reservasIniciales,
} from "./data/datosIniciales";

export default function App() {

  //const [listaHuespedes, setListaHuespedes] = useState([]);
  const [vista, setVista] = useState("inicio");

  const [tipos] = useState(tiposIniciales);
  const [habitaciones] = useState(habitacionesIniciales);
  const [servicios] = useState(serviciosIniciales);
  const [huespedes, setHuespedes] = useState([]);
  const [reservas, setReservas] = useState(reservasIniciales);

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
        setHuespedes([...data, ...huespedes]);
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

  function crearReserva(nuevaReserva) {
    const tipo = tipos.find((t) => t.id === nuevaReserva.tipoHabitacionId);

    if (nuevaReserva.fechaSalida <= nuevaReserva.fechaIngreso) {
      alert("La fecha de salida debe ser posterior a la fecha de ingreso.");
      return;
    }

    if (nuevaReserva.cantidadPersonas > tipo.capacidad) {
      alert("La cantidad de personas supera la capacidad de la habitación.");
      return;
    }

    const haySolapamiento = reservas.some((r) => {
      if (r.habitacionId !== nuevaReserva.habitacionId) return false;
      if (r.estado === "Cancelada") return false;

      return (
        nuevaReserva.fechaIngreso < r.fechaSalida &&
        nuevaReserva.fechaSalida > r.fechaIngreso
      );
    });

    if (haySolapamiento) {
      alert("La habitación ya está reservada en ese rango de fechas.");
      return;
    }

    const nueva = {
      id: Date.now(),
      ...nuevaReserva,
      estado: "Reservada",
      horaCheckIn: "",
    };

    setReservas([...reservas, nueva]);
    alert("Reserva registrada correctamente.");
    setVista("reservas");
  }

  function registrarCheckIn(idReserva) {
    const reserva = reservas.find((r) => r.id === idReserva);

    if (!reserva) {
      alert("Reserva no encontrada.");
      return;
    }

    if (reserva.estado === "Cancelada") {
      alert("No se puede hacer check-in a una reserva cancelada.");
      return;
    }

    if (reserva.horaCheckIn) {
      alert("La reserva ya tiene check-in registrado.");
      return;
    }

    const actualizadas = reservas.map((r) =>
      r.id === idReserva
        ? {
            ...r,
            horaCheckIn: new Date().toLocaleString(),
            estado: "En curso",
          }
        : r
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