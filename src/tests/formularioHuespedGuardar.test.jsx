import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioHuesped from "../components/FormularioHuesped";

jest.mock("../supabase", () => ({
  __esModule: true,
  default: {},
}));

describe("FormularioHuesped - guardar", () => {
  test("envía los datos del huésped cuando el formulario está completo", async () => {
    const onGuardar = jest.fn();

    const { container } = render(<FormularioHuesped onGuardar={onGuardar} />);

    await userEvent.type(
      container.querySelector('input[name="nombreCompleto"]'),
      "Juan Perez"
    );

    await userEvent.type(
      container.querySelector('input[name="numeroDocumento"]'),
      "1234567"
    );

    await userEvent.type(
      container.querySelector('input[name="telefono"]'),
      "70000000"
    );

    await userEvent.type(
      container.querySelector('input[name="correo"]'),
      "juan@gmail.com"
    );

    await userEvent.type(
      container.querySelector('input[name="fechaNacimiento"]'),
      "2000-05-10"
    );

    await userEvent.type(
      container.querySelector('input[name="nacionalidad"]'),
      "Boliviana"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /guardar huésped/i })
    );

    expect(onGuardar).toHaveBeenCalledWith({
      nombreCompleto: "Juan Perez",
      tipoDocumento: "CI",
      numeroDocumento: "1234567",
      telefono: "70000000",
      correo: "juan@gmail.com",
      fechaNacimiento: "2000-05-10",
      nacionalidad: "Boliviana",
    });
  });
});