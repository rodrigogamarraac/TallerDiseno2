import { crearDatosCheckIn } from "../logica/checkinLogica";

test("debe crear los datos de check-in con fecha y estado en curso", () => {
  const fechaCheckIn = new Date("2026-06-18T14:30:00.000Z");

  const resultado = crearDatosCheckIn(fechaCheckIn);

  expect(resultado).toEqual({
    hora_checkin: "2026-06-18T14:30:00.000Z",
    estado: "En curso",
  });
});