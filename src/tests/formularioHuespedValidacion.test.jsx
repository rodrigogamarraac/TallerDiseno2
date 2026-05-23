import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormularioHuesped from "../components/FormularioHuesped";

jest.mock("../supabase", () => ({
  __esModule: true,
  default: {},
}));

describe("FormularioHuesped - validación", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("no guarda el huésped si faltan campos obligatorios", async () => {
    const onGuardar = jest.fn();

    render(<FormularioHuesped onGuardar={onGuardar} />);

    await userEvent.click(
      screen.getByRole("button", { name: /guardar huésped/i })
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Por favor llenat todas las casillas"
    );

    expect(onGuardar).not.toHaveBeenCalled();
  });
});