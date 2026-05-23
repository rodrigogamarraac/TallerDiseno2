import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioReserva from "../components/FormularioReserva";

describe("FormularioReserva - guardar", () => {
  test("envía la reserva con IDs numéricos y datos correctos", async () => {
    const onGuardar = jest.fn();

    const huespedes = [
      {
        id_huesped: 1,
        nombre_completo: "Juan Perez",
      },
    ];

    const tipos = [
      {
        id_tipo_habitacion: 2,
        nombre: "Doble",
        descripcion: "Habitación para dos personas",
        capacidad: 2,
        precio: 250,
      },
    ];

    const habitaciones = [
      {
        id_habitacion: 20,
        numero_habitacion: "201",
        id_tipo_habitacion: 2,
      },
    ];

    const { container } = render(
      <FormularioReserva
        huespedes={huespedes}
        tipos={tipos}
        habitaciones={habitaciones}
        onGuardar={onGuardar}
      />
    );

    const selects = screen.getAllByRole("combobox");

    await userEvent.selectOptions(selects[0], "1");
    await userEvent.selectOptions(selects[1], "2");
    await userEvent.selectOptions(selects[2], "20");

    await userEvent.type(
      container.querySelector('input[name="fechaIngreso"]'),
      "2030-01-10"
    );

    await userEvent.type(
      container.querySelector('input[name="fechaSalida"]'),
      "2030-01-12"
    );

    const cantidadInput = container.querySelector(
      'input[name="cantidadPersonas"]'
    );

    await userEvent.clear(cantidadInput);
    await userEvent.type(cantidadInput, "2");

    await userEvent.click(
      screen.getByRole("button", { name: /guardar reserva/i })
    );

    expect(onGuardar).toHaveBeenCalledWith({
      huespedId: 1,
      tipoHabitacionId: 2,
      habitacionId: 20,
      fechaIngreso: "2030-01-10",
      fechaSalida: "2030-01-12",
      cantidadPersonas: 2,
    });
  });
});