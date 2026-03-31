export const tiposIniciales = [
  {
    id: 1,
    nombre: "Simple",
    descripcion: "1 cama simple",
    capacidad: 1,
    precio: 100,
  },
  {
    id: 2,
    nombre: "Suite",
    descripcion: "1 cama king",
    capacidad: 2,
    precio: 250,
  },
  {
    id: 3,
    nombre: "Doble con camas individuales",
    descripcion: "2 camas individuales",
    capacidad: 2,
    precio: 180,
  },
  {
    id: 4,
    nombre: "Doble matrimonial",
    descripcion: "1 cama matrimonial",
    capacidad: 2,
    precio: 170,
  },
];

export const habitacionesIniciales = [
  { id: 1, numero: "101", tipoHabitacionId: 1 },
  { id: 2, numero: "102", tipoHabitacionId: 1 },
  { id: 3, numero: "201", tipoHabitacionId: 2 },
  { id: 4, numero: "202", tipoHabitacionId: 3 },
  { id: 5, numero: "203", tipoHabitacionId: 4 },
];

export const serviciosIniciales = [
  { id: 1, nombre: "Limpieza", encargado: "María López", telefono: "70011111" },
  { id: 2, nombre: "Recepción", encargado: "José Pérez", telefono: "70022222" },
  { id: 3, nombre: "Mantenimiento", encargado: "Ana Rojas", telefono: "70033333" },
];

export const huespedesIniciales = [
  {
    id: 1,
    nombreCompleto: "Carlos Rojas",
    tipoDocumento: "CI",
    numeroDocumento: "1234567",
    telefono: "76543210",
    correo: "carlos@gmail.com",
    fechaNacimiento: "1998-06-10",
    nacionalidad: "Boliviana",
  },
  {
    id: 2,
    nombreCompleto: "Lucía Fernández",
    tipoDocumento: "CI",
    numeroDocumento: "9876543",
    telefono: "71234567",
    correo: "lucia@gmail.com",
    fechaNacimiento: "1995-03-20",
    nacionalidad: "Boliviana",
  },
];

export const reservasIniciales = [
  {
    id: 1,
    huespedId: 1,
    habitacionId: 1,
    tipoHabitacionId: 1,
    fechaIngreso: "2026-03-29",
    fechaSalida: "2026-03-31",
    cantidadPersonas: 1,
    estado: "Reservada",
    horaCheckIn: "",
  },
  {
    id: 2,
    huespedId: 2,
    habitacionId: 3,
    tipoHabitacionId: 2,
    fechaIngreso: "2026-04-02",
    fechaSalida: "2026-04-05",
    cantidadPersonas: 2,
    estado: "Reservada",
    horaCheckIn: "",
  },
];