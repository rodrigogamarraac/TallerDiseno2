import { ESTADOS_RESERVA } from "./estadoReserva";

export function puedeHacerCheckIn(reserva) {
  if (!reserva) {
    return false;
  }

  if (reserva.estado === ESTADOS_RESERVA.CANCELADA) {
    return false;
  }

  if (reserva.hora_checkin) {
    return false;
  }

  return true;
}

export function crearDatosCheckIn(fechaCheckIn = new Date()) {
  return {
    hora_checkin: fechaCheckIn.toISOString(),
    estado: ESTADOS_RESERVA.EN_CURSO,
  };
}