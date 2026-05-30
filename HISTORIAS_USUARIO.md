# Historias de Usuario usadas para las pruebas unitarias

## HU-09 — Agendar cita
**Historia de usuario:** Como psicóloga, quiero agendar una cita en un horario disponible para registrar una sesión con un paciente.

**Criterio de aceptación:** Dado que existe un horario libre, cuando se intenta registrar una cita en ese rango, entonces el sistema debe permitir la cita.

## HU-10 — Bloquear horarios ocupados
**Historia de usuario:** Como psicóloga, quiero que el sistema bloquee horarios ocupados para evitar dos citas en el mismo rango.

**Criterio de aceptación:** Dado que ya existe una cita registrada, cuando se intenta agendar otra cita que se cruza con ese horario, entonces el sistema debe rechazar ese rango.

## HU-07 — Reprogramar cita
**Historia de usuario:** Como psicóloga, quiero reprogramar una cita existente para actualizar el horario de atención de un paciente.

**Criterio de aceptación:** Dado que estoy editando una cita existente, cuando valido su propio horario, entonces el sistema debe ignorar esa misma cita para no bloquear la edición.

## HU-10 — Mostrar horas de fin válidas
**Historia de usuario:** Como psicóloga, quiero ver solo horas de finalización válidas para no crear citas que invadan otra cita ocupada.

**Criterio de aceptación:** Dado que hay una cita ocupada después del horario de inicio elegido, cuando el sistema muestra las horas de fin disponibles, entonces solo debe mostrar horas que no se crucen con la cita existente.

---

## Relación prueba — Historia de Usuario

| Prueba unitaria | HU relacionada | Qué valida |
|---|---|---|
| `horarioLibrePermiteAgendar.test.js` | HU-09 | Permite agendar cuando el horario está libre. |
| `horarioOcupadoBloqueado.test.js` | HU-10 | Bloquea una cita cuando se cruza con otra cita existente. |
| `edicionIgnoraMismaCita.test.js` | HU-07 | Permite editar una cita ignorando la misma cita por ID. |
| `horariosFinDisponibles.test.js` | HU-10 | Muestra solo horas de fin que no invaden una cita ocupada. |
