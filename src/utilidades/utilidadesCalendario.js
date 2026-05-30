import {
  HORA_INICIO_ATENCION,
  HORA_FIN_ATENCION,
} from "./constantesCalendario.js";

export function generarHorarios(horaInicio = HORA_INICIO_ATENCION, horaFin = HORA_FIN_ATENCION) {
  const horarios = [];

  for (let hora = horaInicio; hora < horaFin; hora++) {
    horarios.push(`${String(hora).padStart(2, "0")}:00`);
    horarios.push(`${String(hora).padStart(2, "0")}:30`);
  }

  horarios.push(`${String(horaFin).padStart(2, "0")}:00`);

  return horarios;
}

function crearFechaHora(fecha, hora) {
  return new Date(`${fecha}T${hora}:00`);
}

function convertirAFecha(valor) {
  return valor instanceof Date ? valor : new Date(valor);
}

export function hayCruce(inicioA, finA, inicioB, finB) {
  return convertirAFecha(inicioA) < convertirAFecha(finB) &&
         convertirAFecha(finA) > convertirAFecha(inicioB);
}

export function horarioEstaLibre(citas, fecha, horaInicio, horaFin, idIgnorado = null) {
  const inicioSolicitado = crearFechaHora(fecha, horaInicio);
  const finSolicitado = crearFechaHora(fecha, horaFin);

  if (!(finSolicitado > inicioSolicitado)) {
    return false;
  }

  return !citas
    .filter((cita) => cita.id !== idIgnorado)
    .some((cita) =>
      hayCruce(
        inicioSolicitado,
        finSolicitado,
        cita.start,
        cita.end
      )
    );
}

export function obtenerHorariosInicioDisponibles(
  citas,
  fecha,
  horarios = generarHorarios(),
  idIgnorado = null
) {
  return horarios.filter((horaInicio, indice) => {
    return horarios
      .slice(indice + 1)
      .some((horaFin) =>
        horarioEstaLibre(citas, fecha, horaInicio, horaFin, idIgnorado)
      );
  });
}

export function obtenerHorariosFinDisponibles(
  citas,
  fecha,
  horaInicio,
  horarios = generarHorarios(),
  idIgnorado = null
) {
  if (!horaInicio) {
    return [];
  }

  const indiceInicio = horarios.indexOf(horaInicio);

  if (indiceInicio === -1) {
    return [];
  }

  return horarios
    .slice(indiceInicio + 1)
    .filter((horaFin) =>
      horarioEstaLibre(citas, fecha, horaInicio, horaFin, idIgnorado)
    );
}

export function filtrarCitas(citas, filtros = {}) {
  const { nombrePaciente, fecha } = filtros;

  return citas.filter((cita) => {
    const coincidePaciente = nombrePaciente
      ? cita.text.toLowerCase().includes(nombrePaciente.toLowerCase())
      : true;

    const coincideFecha = fecha
      ? cita.start.slice(0, 10) === fecha
      : true;

    return coincidePaciente && coincideFecha;
  });
}