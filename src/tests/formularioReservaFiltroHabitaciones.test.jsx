import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioReserva from "../components/FormularioReserva";

describe("FormularioReserva - filtro de habitaciones", () => {
  test("muestra solo las habitaciones del tipo seleccionado", async () => {
    const huespedes = [
      {
        id_huesped: 1,
        nombre_completo: "Juan Perez",
      },
    ];

    const tipos = [
      {
        id_tipo_habitacion: 1,
        nombre: "Simple",
        descripcion: "Habitación simple",
        capacidad: 1,
        precio: 150,
      },
      {
        id_tipo_habitacion: 2,
        nombre: "Doble",
        descripcion: "Habitación doble",
        capacidad: 2,
        precio: 250,
      },
    ];

    const habitaciones = [
      {
        id_habitacion: 10,
        numero_habitacion: "101",
        id_tipo_habitacion: 1,
      },
      {
        id_habitacion: 20,
        numero_habitacion: "201",
        id_tipo_habitacion: 2,
      },
    ];

    render(
      <FormularioReserva
        huespedes={huespedes}
        tipos={tipos}
        habitaciones={habitaciones}
        onGuardar={jest.fn()}
      />
    );

    const selects = screen.getAllByRole("combobox");

    await userEvent.selectOptions(selects[1], "2");

    expect(screen.getByText("Habitación 201")).toBeInTheDocument();
    expect(screen.queryByText("Habitación 101")).not.toBeInTheDocument();
  });
});