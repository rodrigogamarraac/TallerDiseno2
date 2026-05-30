import { validarCapacidadReserva } from "../logica/reservaLogica";

test("debe rechazar una reserva cuando la cantidad de personas supera la capacidad de la habitación", () => {
  const resultado = validarCapacidadReserva(5, 3);

  expect(resultado).toBe(false);
});