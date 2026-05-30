import { validarFechasReserva } from "../logica/reservaLogica";

test("debe rechazar una reserva cuando la fecha de salida es anterior a la fecha de ingreso", () => {
  const resultado = validarFechasReserva("2026-06-12", "2026-06-10");

  expect(resultado).toBe(false);
});