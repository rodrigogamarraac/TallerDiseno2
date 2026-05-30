import { horarioEstaLibre } from "../utilidades/utilidadesCalendario.js";

test("permite agendar una cita cuando el horario está libre", () => {
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
    "11:00",
    "11:30"
  );

  expect(resultado).toBe(true);
});
