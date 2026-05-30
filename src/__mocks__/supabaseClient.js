let mockAppointments = [];
let insertedPayloads = [];
let updatedPayloads = [];
let deletedIds = [];

export function __resetSupabaseMocks() {
  mockAppointments = [];
  insertedPayloads = [];
  updatedPayloads = [];
  deletedIds = [];
}

export function __setMockAppointments(rows) {
  mockAppointments = rows;
}

export function __getInsertedPayloads() {
  return insertedPayloads;
}

export function __getUpdatedPayloads() {
  return updatedPayloads;
}

export function __getDeletedIds() {
  return deletedIds;
}

export const supabase = {
  from() {
    return {
      select() {
        return {
          order: async () => ({
            data: mockAppointments,
            error: null,
          }),
        };
      },

      insert(payload) {
        insertedPayloads.push(payload);

        const row = {
          id: 100 + insertedPayloads.length,
          title: payload.title,
          start_time: payload.start_time,
          end_time: payload.end_time,
        };

        mockAppointments.push(row);

        return {
          select() {
            return {
              single: async () => ({
                data: row,
                error: null,
              }),
            };
          },
        };
      },

      update(payload) {
        return {
          eq(field, value) {
            updatedPayloads.push({
              id: value,
              payload,
            });

            const row = {
              id: value,
              title: payload.title,
              start_time: payload.start_time,
              end_time: payload.end_time,
            };

            mockAppointments = mockAppointments.map((appointment) =>
              String(appointment.id) === String(value)
                ? { ...appointment, ...row }
                : appointment
            );

            return {
              select() {
                return {
                  single: async () => ({
                    data: row,
                    error: null,
                  }),
                };
              },
            };
          },
        };
      },

      delete() {
        return {
          eq: async (field, value) => {
            deletedIds.push(value);

            mockAppointments = mockAppointments.filter(
              (appointment) => String(appointment.id) !== String(value)
            );

            return {
              error: null,
            };
          },
        };
      },
    };
  },
};