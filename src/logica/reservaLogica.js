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
  return reservas.some((reservaExistente) => {
    const esMismaHabitacion =
      reservaExistente.id_habitacion === nuevaReserva.habitacionId;

    const estaCancelada = reservaExistente.estado === ESTADOS_RESERVA.CANCELADA;

    const fechasSeCruzan = nuevaReserva.fechaIngreso < reservaExistente.fecha_salida && nuevaReserva.fechaSalida > reservaExistente.fecha_ingreso;

    return esMismaHabitacion && !estaCancelada && fechasSeCruzan;
  });
}

export function crearDatosReserva(nuevaReserva) {
  return {
    fecha_ingreso: nuevaReserva.fechaIngreso,
    fecha_salida: nuevaReserva.fechaSalida,
    cantidad_personas: nuevaReserva.cantidadPersonas,
    estado: ESTADOS_RESERVA.RESERVADA,
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

export function esTipoHabitacionValido(tiposHabitacion, tipoHabitacionId) {
  return tiposHabitacion.some(
    (tipoHabitacion) =>
      tipoHabitacion.id_tipo_habitacion === tipoHabitacionId
  );
}

export function obtenerTipoHabitacionSeleccionado(tiposHabitacion, tipoHabitacionId) {
  return tiposHabitacion.find(
    (tipoHabitacion) =>
      tipoHabitacion.id_tipo_habitacion === tipoHabitacionId
  );
}