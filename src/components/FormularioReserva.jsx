import { useState } from "react";

export default function FormularioReserva({
  huespedes,
  tipos,
  habitaciones,
  onGuardar,
}) {
  const [formulario, setFormulario] = useState({
    huespedId: "",
    tipoHabitacionId: "",
    habitacionId: "",
    fechaIngreso: "",
    fechaSalida: "",
    cantidadPersonas: 1,
  });

  function cambiar(e) {
    setFormulario({
      ...formulario,
      [e.target.name]:
        e.target.name === "cantidadPersonas"
          ? Number(e.target.value)
          : e.target.value,
    });
  }

  const tipoSeleccionado = tipos.find(
    (t) => t.id === Number(formulario.tipoHabitacionId)
  );

  const habitacionesFiltradas = habitaciones.filter(
    (h) => h.tipoHabitacionId === Number(formulario.tipoHabitacionId)
  );

  function enviar(e) {
    e.preventDefault();

    if (
      !formulario.huespedId ||
      !formulario.tipoHabitacionId ||
      !formulario.habitacionId ||
      !formulario.fechaIngreso ||
      !formulario.fechaSalida
    ) {
      alert("Completa todos los campos.");
      return;
    }

    onGuardar(formulario);
    /*onGuardar({
      huespedId: Number(formulario.huespedId),
      tipoHabitacionId: Number(formulario.tipoHabitacionId),
      habitacionId: Number(formulario.habitacionId),
      fechaIngreso: formulario.fechaIngreso,
      fechaSalida: formulario.fechaSalida,
      cantidadPersonas: Number(formulario.cantidadPersonas),
    });*/

    setFormulario({
      huespedId: "",
      tipoHabitacionId: "",
      habitacionId: "",
      fechaIngreso: "",
      fechaSalida: "",
      cantidadPersonas: 1,
    });
  }

  return (
    <div>
      <h2>Crear reserva</h2>

      <form className="formulario" onSubmit={enviar}>
        <div className="campo">
          <label>Huésped</label>
          <select
            name="huespedId"
            value={formulario.huespedId}
            onChange={cambiar}
          >
            <option value="">Seleccione</option>
            {huespedes.map((h) => (
              <option key={h.id} value={h.id}>
                {h.nombre_completo}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Tipo de habitación</label>
          <select
            name="tipoHabitacionId"
            value={formulario.tipoHabitacionId}
            onChange={cambiar}
          >
            <option value="">Seleccione</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {tipoSeleccionado && (
          <div className="resumen-tipo">
            <h4>Resumen del tipo seleccionado</h4>
            <p><strong>Descripción:</strong> {tipoSeleccionado.descripcion}</p>
            <p><strong>Capacidad:</strong> {tipoSeleccionado.capacidad}</p>
            <p><strong>Precio referencial:</strong> Bs. {tipoSeleccionado.precio}</p>
          </div>
        )}

        <div className="campo">
          <label>Habitación</label>
          <select
            name="habitacionId"
            value={formulario.habitacionId}
            onChange={cambiar}
          >
            <option value="">Seleccione</option>
            {habitacionesFiltradas.map((h) => (
              <option key={h.id} value={h.id}>
                Habitación {h.numero}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Fecha de ingreso</label>
          <input
            type="date"
            name="fechaIngreso"
            value={formulario.fechaIngreso}
            onChange={cambiar}
          />
        </div>

        <div className="campo">
          <label>Fecha de salida</label>
          <input
            type="date"
            name="fechaSalida"
            value={formulario.fechaSalida}
            onChange={cambiar}
          />
        </div>

        <div className="campo">
          <label>Cantidad de personas</label>
          <input
            type="number"
            min="1"
            name="cantidadPersonas"
            value={formulario.cantidadPersonas}
            onChange={cambiar}
          />
        </div>

        <button className="boton-principal" type="submit">
          Guardar reserva
        </button>
      </form>
    </div>
  );
}