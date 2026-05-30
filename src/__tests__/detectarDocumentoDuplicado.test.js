import { existeDocumentoDuplicado } from "../logica/huespedLogica";

test("debe detectar cuando ya existe un huésped con el mismo documento", () => {
  const huespedes = [
    {
      nombre_completo: "Ana López",
      numero_documento: "777",
    },
  ];

  const resultado = existeDocumentoDuplicado(huespedes, "777");

  expect(resultado).toBe(true);
});