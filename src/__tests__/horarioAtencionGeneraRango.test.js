import { generarHorarios } from "../utilidades/utilidadesCalendario.js";
import {
  HORA_INICIO_ATENCION,
  HORA_FIN_ATENCION,
} from "../utilidades/constantesCalendario.js";

test("genera horarios dentro del rango de atención configurado", () => {
  const primerHorarioEsperado = "08:00";
  const ultimoHorarioEsperado = "20:00";
  const horarioFueraDeRango = "20:30";

  const horarios = generarHorarios();

  expect(horarios[0]).toBe(primerHorarioEsperado);
  expect(horarios).toContain(ultimoHorarioEsperado);
  expect(horarios).not.toContain(horarioFueraDeRango);
  expect(horarios[0]).toBe(
    `${String(HORA_INICIO_ATENCION).padStart(2, "0")}:00`
  );
  expect(horarios[horarios.length - 1]).toBe(
    `${String(HORA_FIN_ATENCION).padStart(2, "0")}:00`
  );
});