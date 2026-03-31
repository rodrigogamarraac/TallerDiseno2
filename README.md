# Sistema de reservas para hotel pequeño

## Descripción general de la solución

Este proyecto consiste en un prototipo funcional para la gestión básica de reservas de un hotel pequeño. El sistema permite registrar huéspedes, crear reservas, consultar reservas activas y futuras, registrar check-in, visualizar contactos de servicios del hotel y consultar la información de un huésped.

La aplicación fue desarrollada como un MVP académico, enfocándose en las funciones principales del proceso de recepción y hospedaje. Los datos se almacenan en Supabase y la interfaz fue construida con React.

## Arquitectura utilizada

El sistema fue desarrollado con React utilizando una organización basada en componentes. La lógica principal de la aplicación se centraliza en App.jsx, donde se controla:

- la navegación entre pantallas,
- el estado general de la aplicación,
- los datos desde Supabase,
- y las operaciones principales como registrar huéspedes, crear reservas y registrar check-in.

Las pantallas y componentes de la carpeta comonents se encargan de mostrar la información al usuario.

Con esto la arquitectura del proyecto puede describirse como una arquitectura de frontend basada en componentes, con una separación parcial inspirada en MVC:

- **Vista:** componentes de interfaz.
- **Control:** `App.jsx`, que coordina flujo, estado y acciones.
- **Modelo:** datos almacenados en Supabase.

No se trata de un MVC estricto, ya que parte de la lógica y del acceso a datos todavía se encuentra centralizada en `App.jsx`.

## Modelo de base de datos

El sistema trabaja con las siguientes entidades principales:

- **huesped**: almacena los datos del huésped, como nombre, documento, teléfono, correo, fecha de nacimiento y nacionalidad.
- **tipo_habitacion**: almacena los tipos de habitación disponibles y sus características principales.
- **habitacion**: almacena las habitaciones del hotel y su tipo asociado.
- **reserva**: registra la reserva realizada, incluyendo huésped titular, habitación, tipo de habitación, fechas, cantidad de personas, estado, hora de check-in y hora de check-out.
- **servicio**: almacena los contactos de servicios del hotel, incluyendo nombre del servicio, encargado y teléfono.

### Relación general de entidades

- Un **huésped** puede tener varias **reservas**.
- Un **tipo de habitación** puede estar asociado a varias **habitaciones**.
- Una **habitación** puede aparecer en varias **reservas** en diferentes fechas.
- Los **servicios** se gestionan de forma independiente como información de apoyo para recepción.

## Funcionalidades implementadas

Las funcionalidades implementadas en el prototipo son:

1. **Registrar huésped**
   - Registro de datos básicos del huésped.
   - Validación de campos obligatorios.
   - Prevención de duplicados por número de documento.

2. **Crear reserva**
   - Asociación de huésped, tipo de habitación, habitación y fechas de estadía.
   - Validación de fechas.
   - Validación de capacidad máxima según el tipo de habitación.
   - Validación para evitar solapamiento de reservas.

3. **Consultar reservas activas y futuras**
   - Visualización de reservas registradas.
   - Orden cronológico por fecha de ingreso.
   - Mensaje cuando no existen reservas disponibles.

4. **Registrar check-in**
   - Registro de fecha y hora de ingreso.
   - Cambio de estado de la reserva a “En curso”.
   - Validación para evitar check-in duplicado.
   - Restricción de check-in en reservas canceladas.

5. **Visualizar contactos de servicios**
   - Muestra los servicios del hotel.
   - Visualiza nombre del servicio, encargado y teléfono.
   - Mensaje cuando no existen contactos cargados.

6. **Consultar información de huésped**
   - Listado de huéspedes registrados.
   - Visualización de sus datos principales.
   - Opción para expandir y cerrar el detalle del huésped.

## Tecnologías utilizadas

- React
- JavaScript
- CSS
- Supabase

# Como correr el sistema

- Descargar archivo y descomprimir
- En el cmd correr "npm run dev"
- El sistema correra localmente
