import { existeSolapamientoReserva } from "../logica/reservaLogica";

test("debe detectar solapamiento cuando la habitación ya está reservada en esas fechas", () => {
  const nuevaReserva = {
    habitacionId: 1,
    fechaIngreso: "2026-06-11",
    fechaSalida: "2026-06-13",
  };

  const reservas = [
    {
      id_habitacion: 1,
      fecha_ingreso: "2026-06-10",
      fecha_salida: "2026-06-12",
      estado: "Reservada",
    },
  ];

  const resultado = existeSolapamientoReserva(nuevaReserva, reservas);

  expect(resultado).toBe(true);
});