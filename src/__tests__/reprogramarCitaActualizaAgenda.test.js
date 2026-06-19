import { reprogramarCitaEnLista } from "../utilidades/utilidadesCalendario.js";

test("actualiza fecha y hora de una cita reprogramada en la agenda", () => {
  const citas = [
    {
      id: 7,
      text: "Luis Rojas",
      start: "2026-06-22T09:00:00",
      end: "2026-06-22T10:00:00",
    },
  ];
  const citaReprogramada = {
    id: 7,
    text: "Luis Rojas",
    start: "2026-06-24T15:00:00",
    end: "2026-06-24T16:00:00",
  };


  const resultado = reprogramarCitaEnLista(citas, citaReprogramada);


  expect(resultado).toHaveLength(1);
  expect(resultado[0].start).toBe("2026-06-24T15:00:00");
  expect(resultado[0].end).toBe("2026-06-24T16:00:00");
  expect(resultado[0].start).not.toBe("2026-06-22T09:00:00");
});