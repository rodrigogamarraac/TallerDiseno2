import React from "react";

class MockDayPilotDate {
  constructor(value) {
    if (value instanceof MockDayPilotDate) {
      this.date = new global.Date(value.date);
    } else {
      this.date = new global.Date(value);
    }
  }

  static today() {
    return new MockDayPilotDate("2026-03-03T00:00:00");
  }

  addDays(days) {
    const d = new global.Date(this.date);
    d.setDate(d.getDate() + days);
    return new MockDayPilotDate(d);
  }

  addMonths(months) {
    const d = new global.Date(this.date);
    d.setMonth(d.getMonth() + months);
    return new MockDayPilotDate(d);
  }

  firstDayOfMonth() {
    const d = new global.Date(this.date);
    d.setDate(1);
    return new MockDayPilotDate(d);
  }

  valueOf() {
    return this.date.getTime();
  }

  toString(format) {
    const pad = (n) => String(n).padStart(2, "0");

    const year = this.date.getFullYear();
    const month = pad(this.date.getMonth() + 1);
    const day = pad(this.date.getDate());
    const hour = pad(this.date.getHours());
    const minute = pad(this.date.getMinutes());
    const second = pad(this.date.getSeconds());

    if (format === "yyyy-MM-dd") {
      return `${year}-${month}-${day}`;
    }

    if (format === "yyyy-MM-ddTHH:mm:ss") {
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }
}

function CalendarMock({ viewType, visible, events = [], onEventClick }) {
  if (!visible) return null;

  return (
    <div data-testid={`calendar-${viewType}`}>
      <span data-testid="events-count">{events.length}</span>

      {events.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() =>
            onEventClick?.({
              preventDefault: () => {},
              e: {
                data: event,
                id: () => event.id,
                text: () => event.text,
              },
            })
          }
        >
          {event.text}
        </button>
      ))}
    </div>
  );
}

export const DayPilot = {
  Date: MockDayPilotDate,
};

export function DayPilotCalendar(props) {
  return <CalendarMock {...props} />;
}

export function DayPilotMonth(props) {
  return <CalendarMock viewType="Month" {...props} />;
}