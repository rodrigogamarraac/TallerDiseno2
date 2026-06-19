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

export function crearDatosHuesped(nuevoHuesped) {
  return {
    nombre_completo: nuevoHuesped.nombreCompleto,
    tipo_documento: nuevoHuesped.tipoDocumento,
    numero_documento: nuevoHuesped.numeroDocumento,
    telefono: nuevoHuesped.telefono,
    correo: nuevoHuesped.correo,
    fecha_nacimiento: nuevoHuesped.fechaNacimiento,
    nacionalidad: nuevoHuesped.nacionalidad,
  };
}