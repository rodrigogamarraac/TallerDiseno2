import { ESTADOS_RESERVA } from "./estadoReserva";

export function validarFechasReserva(fechaIngreso, fechaSalida) {
  if (!fechaIngreso || !fechaSalida) {
    return false;
  }

  const ingreso = new Date(fechaIngreso);
  const salida = new Date(fechaSalida);

  return salida > ingreso;
}

export function validarCapacidadReserva(cantidadPersonas, capacidadHabitacion) {
  if (!cantidadPersonas || !capacidadHabitacion) {
    return false;
  }

  return Number(cantidadPersonas) <= Number(capacidadHabitacion);
}

export function existeSolapamientoReserva(nuevaReserva, reservas) {
  return reservas.some((reserva) => {
    if (reserva.id_habitacion !== nuevaReserva.habitacionId) {
      return false;
    }

    if (reserva.estado === "Cancelada") {
      return false;
    }

    return (
      nuevaReserva.fechaIngreso < reserva.fecha_salida &&
      nuevaReserva.fechaSalida > reserva.fecha_ingreso
    );
  });
}

export function crearDatosReserva(nuevaReserva) {
  return {
    fecha_ingreso: nuevaReserva.fechaIngreso,
    fecha_salida: nuevaReserva.fechaSalida,
    cantidad_personas: nuevaReserva.cantidadPersonas,
    estado: "Reservada",
    hora_checkin: null,
    hora_checkout: null,
    id_habitacion: nuevaReserva.habitacionId,
    id_tipo_habitacion: nuevaReserva.tipoHabitacionId,
    id_huesped_titular: nuevaReserva.huespedId,
  };
}

function esReservaVigente(reserva, fechaBase) {
  const noEstaCancelada = reserva.estado !== ESTADOS_RESERVA.CANCELADA;
  const noFinalizo = new Date(reserva.fecha_salida) >= fechaBase;

  return noEstaCancelada && noFinalizo;
}

function compararPorFechaIngreso(reservaA, reservaB) {
  return new Date(reservaA.fecha_ingreso) - new Date(reservaB.fecha_ingreso);
}

export function obtenerReservasActivasYFuturas(reservas, fechaReferencia) {
  const fechaBase = new Date(fechaReferencia);

  return reservas
    .filter((reserva) => esReservaVigente(reserva, fechaBase))
    .sort(compararPorFechaIngreso);
}