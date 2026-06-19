import { esTipoHabitacionValido } from "../logica/reservaLogica";

test("Debe rechazar una reserva cuando el tipo de habitacion es invalido", () => {
  const tiposHabitacion = [
    {
      id_tipo_habitacion: 1,
      nombre: "Simple",
    },
    {
      id_tipo_habitacion: 2,
      nombre: "Suite",
    },
  ];

  const resultado = esTipoHabitacionValido(tiposHabitacion, 99);

  expect(resultado).toBe(false);
});