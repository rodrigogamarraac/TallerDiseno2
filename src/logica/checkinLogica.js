export function puedeHacerCheckIn(reserva) {
  if (!reserva) {
    return false;
  }

  if (reserva.estado === "Cancelada") {
    return false;
  }

  if (reserva.hora_checkin) {
    return false;
  }

  return true;
}