# EC2 — Reporte de Examen Parcial

**Estudiante:** [Gamarra Rodrigo]  
**Fecha de entrega:** [23/05/2026]  
**Proyectos presentados:** [Reservas Hotel] | [Citas Psicologo] | [Creditos Banco]

---

## 1. Reporte de cobertura inicial (0%)

### Proyecto A — Hotel pequeño

> Adjuntar reporte PDF/HTML. Indicar herramienta utilizada y describir brevemente
> cómo se configuró para excluir archivos que no aplican.

### Proyecto B — Sistema de citas con psicólogo

> Ídem.

### Proyecto C — Sistema de creditos para un banco

> Ídem.

---

## 2. Pruebas unitarias

### 2.1 Traza completa — una prueba representativa por proyecto

> Documentar la prueba más significativa de cada proyecto con el trazado completo.
> No se aceptan capturas de pantalla del código — solo snippets.

#### Proyecto A — Validar la creacion de una reserva de habitacion

**HU relacionada:** Como recepcionista
quiero registrar una reserva asociando huésped, habitación y fechas de estadía
para organizar el uso de las habitaciones disponibles del hotel.
 
**Criterio de aceptación:**

> Dado que existen huéspedes y habitaciones precargadas, cuando el usuario
complete los datos requeridos de la reserva, entonces el sistema debe
registrarla correctamente.


**Cobertura antes:** 0%

**Código a probar:**

```csharp / typescript
onGuardar({
  huespedId: Number(formulario.huespedId),
  tipoHabitacionId: Number(formulario.tipoHabitacionId),
  habitacionId: Number(formulario.habitacionId),
  fechaIngreso: formulario.fechaIngreso,
  fechaSalida: formulario.fechaSalida,
  cantidadPersonas: Number(formulario.cantidadPersonas),
});
```

**Explicación:**

> En esta prueba se está cubriendo el camino de ejecución exitoso del formulario de reserva. Esto pasa porque en la prueba se selecciona un huésped, un tipo de habitación, una habitación, fechas de ingreso y salida, y una cantidad de personas válida. Como todos los datos necesarios están completos, el código no se detiene por validaciones y llega hasta la ejecución de onGuardar.

**Cobertura después:** 33.84%

---

#### Proyecto B — Vista Semana Inicial

**HU relacionada:** Como psicóloga, quiero ver mi agenda semanal con todas mis sesiones programadas, para organizar mis citas  
**Criterio de aceptación:**

> Dado que existen citas registradas en la semana, cuando ingreso a la vista de agenda semanal, entonces debo ver todas las sesiones programadas de esa semana.

**Cobertura antes:** 0%

**Código a probar:**

```csharp / typescript
const [view, setView] = useState("Week");
```

**Explicación:**

> En esta prueba se está cubriendo el camino de ejecución exitoso de carga inicial del calendario. Esto pasa porque al renderizar el componente, no hay citas cargadas en el mock y el calendario inicia correctamente en la vista “Week”. Como el estado inicial es válido, el código no entra en errores ni cambios de vista, y llega a mostrar el botón Week como seleccionado junto con el calendario semanal.

**Cobertura después:** 48.83%

---

#### Proyecto C — Ver historial crediticio

**HU relacionada:** Como Supervisor, quiero ver el historial de crédito de un usuario para analizar si es viable darle un crédito
 
**Criterio de aceptación:**

> Dado un usuario existente, cuando lo busco, entonces veo su puntaje

**Cobertura antes:** 0%

**Código a probar:**

```csharp / typescript
const { data, error } = await supabase
  .from("credit_histories")
  .select("credit_score")
  .eq("client_id", trimmed)
  .maybeSingle();
```

**Explicación:**

> En esta prueba se está cubriendo el camino de ejecución exitoso de la consulta del historial crediticio. Esto pasa porque en la prueba se ingresa un ID de cliente válido y luego se presiona el botón “Ver historial”. Como el ID no está vacío, el código no se detiene en la validación de “Ingresa un ID de usuario” y continúa hasta hacer la consulta a Supabase en la tabla credit_histories.

**Cobertura después:** 96%

---
