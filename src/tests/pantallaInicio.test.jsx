import { render, screen } from "@testing-library/react";
import Inicio from "../components/Inicio";

describe("Pantalla Inicio", () => {
  test("muestra correctamente la pantalla de inicio", () => {

    const { container } = render(
      <Inicio
      />
    );

    expect(
      screen.getByRole("heading", {
        name: /gestion de reservas para hotel/i,
      })
    ).toBeInTheDocument();

    expect(container.querySelector(".tarjetas-resumen")).toBeInTheDocument();
  });
});