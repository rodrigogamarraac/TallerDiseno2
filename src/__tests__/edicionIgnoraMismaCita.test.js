import { horarioEstaLibre } from "../utilidades/utilidadesCalendario.js";

test("permite reprogramar una cita ignorando la misma cita que se está editando", () => {
  const citas = [
    {
      id: 7,
      text: "Paciente Luis",
      start: "2026-03-03T09:00:00",
      end: "2026-03-03T10:00:00",
    },
  ];

  const resultado = horarioEstaLibre(
    citas,
    "2026-03-03",
    "09:00",
    "10:00",
    7
  );

  expect(resultado).toBe(true);
});
