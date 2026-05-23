import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PantallaConsultarHuesped from "../components/PantallaConsultarHuesped";

describe("PantallaConsultarHuesped", () => {
  test("muestra y oculta la información detallada de un huésped", async () => {
    const huespedes = [
      {
        id_huesped: 1,
        nombre_completo: "Juan Perez",
        tipo_documento: "CI",
        numero_documento: "1234567",
        telefono: "70000000",
        correo: "juan@gmail.com",
        fecha_nacimiento: "2000-05-10",
        nacionalidad: "Boliviana",
      },
    ];

    render(<PantallaConsultarHuesped huespedes={huespedes} />);

    expect(screen.queryByText(/juan@gmail.com/i)).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /ver información/i })
    );

    expect(screen.getByText(/juan@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/boliviana/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /cerrar/i }));

    expect(screen.queryByText(/juan@gmail.com/i)).not.toBeInTheDocument();
  });
});