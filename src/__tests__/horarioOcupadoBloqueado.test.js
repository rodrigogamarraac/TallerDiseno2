import { horarioEstaLibre } from "../utilidades/utilidadesCalendario.js";

test("bloquea una nueva cita cuando el horario se cruza con una cita existente", () => {
  const citas = [
    {
      id: 1,
      text: "Paciente Ana",
      start: "2026-03-03T10:00:00",
      end: "2026-03-03T11:00:00",
    },
  ];

  const resultado = horarioEstaLibre(
    citas,
    "2026-03-03",
    "10:30",
    "11:30"
  );

  expect(resultado).toBe(false);
});
