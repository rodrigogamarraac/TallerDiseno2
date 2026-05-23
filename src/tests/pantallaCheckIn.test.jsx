import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PantallaCheckIn from "../components/PantallaCheckIn";

describe("PantallaCheckIn", () => {
  test("muestra solo reservas pendientes de check-in y ejecuta onCheckIn", async () => {
    const onCheckIn = jest.fn();

    const reservas = [
      {
        id_reserva: 1,
        estado: "Reservada",
        hora_checkin: null,
        id_huesped_titular: 1,
        id_habitacion: 10,
        fecha_ingreso: "2030-01-10",
        fecha_salida: "2030-01-12",
      },
      {
        id_reserva: 2,
        estado: "Cancelada",
        hora_checkin: null,
        id_huesped_titular: 2,
        id_habitacion: 20,
        fecha_ingreso: "2030-01-10",
        fecha_salida: "2030-01-12",
      },
      {
        id_reserva: 3,
        estado: "En curso",
        hora_checkin: "2030-01-10T10:00:00",
        id_huesped_titular: 3,
        id_habitacion: 30,
        fecha_ingreso: "2030-01-10",
        fecha_salida: "2030-01-12",
      },
    ];

    const huespedes = [
      {
        id_huesped: 1,
        nombre_completo: "Juan Perez",
      },
      {
        id_huesped: 2,
        nombre_completo: "Maria Lopez",
      },
      {
        id_huesped: 3,
        nombre_completo: "Carlos Rojas",
      },
    ];

    const habitaciones = [
      {
        id_habitacion: 10,
        numero_habitacion: "101",
      },
      {
        id_habitacion: 20,
        numero_habitacion: "201",
      },
      {
        id_habitacion: 30,
        numero_habitacion: "301",
      },
    ];

    render(
      <PantallaCheckIn
        reservas={reservas}
        huespedes={huespedes}
        habitaciones={habitaciones}
        onCheckIn={onCheckIn}
      />
    );

    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.queryByText("Maria Lopez")).not.toBeInTheDocument();
    expect(screen.queryByText("Carlos Rojas")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /hacer check-in/i })
    );

    expect(onCheckIn).toHaveBeenCalledWith(1);
  });
});