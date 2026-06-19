import { obtenerReservasActivasYFuturas } from "../logica/reservaLogica";

test("debe mostrar solo reservas activas y futuras ordenadas por fecha de ingreso", () => {
  const reservas = [
    {
      id_reserva: 1,
      fecha_ingreso: "2026-06-20",
      fecha_salida: "2026-06-21",
      estado: "Reservada",
    },
    {
      id_reserva: 2,
      fecha_ingreso: "2026-06-18",
      fecha_salida: "2026-06-19",
      estado: "Reservada",
    },
    {
      id_reserva: 3,
      fecha_ingreso: "2026-06-10",
      fecha_salida: "2026-06-11",
      estado: "Reservada",
    },
    {
      id_reserva: 4,
      fecha_ingreso: "2026-06-22",
      fecha_salida: "2026-06-23",
      estado: "Cancelada",
    },
  ];

  const resultado = obtenerReservasActivasYFuturas(reservas, "2026-06-18");

  expect(resultado.map((reserva) => reserva.id_reserva)).toEqual([2, 1]);
});