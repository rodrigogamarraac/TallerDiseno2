import {
  obtenerHorariosFinDisponibles,
  generarHorarios,
} from "../utilidades/utilidadesCalendario.js";

test("muestra solo horarios de fin que no invaden una cita ocupada", () => {
  const citas = [
    {
      id: 1,
      text: "Paciente Ana",
      start: "2026-03-03T10:00:00",
      end: "2026-03-03T11:00:00",
    },
  ];

  const resultado = obtenerHorariosFinDisponibles(
    citas,
    "2026-03-03",
    "09:00",
    generarHorarios(9, 11)
  );

  expect(resultado).toEqual(["09:30", "10:00"]);
});
