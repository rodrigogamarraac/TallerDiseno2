import { validarSolicitudCita } from "../utilidades/utilidadesCalendario.js";

test("devuelve error cuando se intenta agendar en un horario ocupado", () => {
  const citas = [
    {
      id: 1,
      text: "Ana Fernandez",
      start: "2026-06-22T10:00:00",
      end: "2026-06-22T11:00:00",
    },
  ];

  const resultado = validarSolicitudCita(
    citas,
    "2026-06-22",
    "10:30",
    "11:00"
  );

  expect(resultado.valida).toBe(false);
  expect(resultado.mensaje).toBe("El horario seleccionado no esta disponible.");
});