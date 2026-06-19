import { filtrarCitas } from "../utilidades/utilidadesCalendario.js";

test("filtra citas por paciente ignorando espacios y mayúsculas", () => {
  const citas = [
    {
      id: 1,
      text: "Ana Fernandez",
      start: "2026-06-22T09:00:00",
      end: "2026-06-22T10:00:00",
    },
    {
      id: 2,
      text: "Luis Rojas",
      start: "2026-06-22T11:00:00",
      end: "2026-06-22T12:00:00",
    },
  ];

  const resultado = filtrarCitas(citas, {
    nombrePaciente: "  ana  ",
  });

  expect(resultado).toHaveLength(1);
  expect(resultado[0].id).toBe(1);
});