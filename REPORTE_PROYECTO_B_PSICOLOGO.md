# Proyecto B — Sistema de citas con psicólogo

## Herramienta de pruebas y cobertura

Se utilizó Jest con `--coverage` para generar el reporte de cobertura del frontend React. La configuración se enfocó únicamente en `src/utilidades/**/*.js`, porque ahí está la lógica de negocio relacionada con disponibilidad de horarios y cruces entre citas.

## Prueba representativa

### Proyecto B — Bloquear una nueva cita cuando el horario se cruza con una cita existente

**HU relacionada:** HU-10 — Bloquear horarios ocupados

**Criterio de aceptación:**
> Dado que ya existe una cita registrada, cuando se intenta agendar otra cita que se cruza con ese horario, entonces el sistema debe rechazar ese rango.

**Cobertura antes:** 0%

**Código a probar:**
```javascript
export function horarioEstaLibre(citas, fecha, horaInicio, horaFin, idIgnorado = null) {
  const inicioSolicitado = crearFechaHora(fecha, horaInicio);
  const finSolicitado = crearFechaHora(fecha, horaFin);

  if (!(finSolicitado > inicioSolicitado)) {
    return false;
  }

  return !citas
    .filter((cita) => cita.id !== idIgnorado)
    .some((cita) =>
      hayCruce(
        inicioSolicitado,
        finSolicitado,
        cita.start,
        cita.end
      )
    );
}
```

**Prueba unitaria:**
```javascript
import { horarioEstaLibre } from "../utilidades/utilidadesCalendario.js";

test("bloquea una nueva cita cuando el horario se cruza con una cita existente", () => {
  const citas = [
    {
      id: 1,
      text: "Paciente Ana",
      start: "2026-03-03T10:00:00",
      end: "2026-03-03T11:00:00",
    },
  ];

  const resultado = horarioEstaLibre(
    citas,
    "2026-03-03",
    "10:30",
    "11:30"
  );

  expect(resultado).toBe(false);
});
```

**Explicación:**
> En esta prueba se está cubriendo el camino de ejecución inválido por cruce de horarios. Esto pasa porque ya existe una cita de 10:00 a 11:00 y la prueba intenta crear otra de 10:30 a 11:30. Como ambos rangos se solapan, la función detecta el cruce con `hayCruce` y devuelve `false`, evitando que se registre una cita encima de otra.

**Cobertura después:** 65.62% en statements sobre `src/utilidades/utilidadesCalendario.js`.

## Resumen de las 4 pruebas unitarias

| # | Proyecto | Nombre de la prueba | HU relacionada | Qué cubre | Commit sugerido |
|---|---|---|---|---|---|
| 1 | Proyecto B | `horarioLibrePermiteAgendar.test.js` | HU-09 | Valida que una cita se pueda agendar cuando no existe cruce de horario. | `test(frontend): agregar prueba para horario libre de cita` |
| 2 | Proyecto B | `horarioOcupadoBloqueado.test.js` | HU-10 | Valida que el sistema bloquee una cita que se cruza con una ya existente. | `test(frontend): agregar prueba para bloqueo de horario ocupado` |
| 3 | Proyecto B | `edicionIgnoraMismaCita.test.js` | HU-07 | Valida que al editar una cita se ignore su propio ID para no bloquearse a sí misma. | `test(frontend): agregar prueba para reprogramacion de cita` |
| 4 | Proyecto B | `horariosFinDisponibles.test.js` | HU-10 | Valida que las horas de fin disponibles no invadan una cita ocupada. | `test(frontend): agregar prueba para horarios de fin disponibles` |
