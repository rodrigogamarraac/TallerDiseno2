export function validarDatosHuesped(huesped) {
  if (!huesped) {
    return false;
  }

  if (!huesped.nombreCompleto || !huesped.numeroDocumento) {
    return false;
  }

  return true;
}

export function existeDocumentoDuplicado(huespedes, numeroDocumento) {
  return huespedes.some(
    (huesped) => huesped.numero_documento === numeroDocumento
  );
}