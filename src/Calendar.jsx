import React, { useMemo, useState } from "react";
import { DayPilot, DayPilotCalendar, DayPilotMonth } from "@daypilot/daypilot-lite-react";

export default function Calendar() {
  const [view, setView] = useState("Week");
  const [startDate, setStartDate] = useState(DayPilot.Date.today());

  const [events, setEvents] = useState([
    {
      id: 1,
      text: "Appointment - John",
      start: "2026-03-03T10:00:00",
      end: "2026-03-03T11:00:00",
    },
  ]);

  // ---- Modal state ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apptTitle, setApptTitle] = useState("Nueva cita");
  const [apptDate, setApptDate] = useState(startDate.toString("yyyy-MM-dd"));
  const [apptStart, setApptStart] = useState(null); // "HH:mm"
  const [apptEnd, setApptEnd] = useState(null);     // "HH:mm"

  // Business hours (change if you want)
  const BUSINESS_START = 8;  // 08:00
  const BUSINESS_END = 20;   // 20:00 (last start slot is 19:30)

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = BUSINESS_START; h < BUSINESS_END; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  function toDpDate(dateStr, timeStr) {
    // dateStr: "yyyy-MM-dd", timeStr: "HH:mm"
    return new DayPilot.Date(`${dateStr}T${timeStr}:00`);
  }

  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && aEnd > bStart;
  }

  function dayEvents(dateStr) {
    const dayStart = new DayPilot.Date(`${dateStr}T00:00:00`);
    const dayEnd = new DayPilot.Date(`${dateStr}T23:59:59`);

    return events
      .map((e) => ({
        ...e,
        startDp: new DayPilot.Date(e.start),
        endDp: new DayPilot.Date(e.end),
      }))
      .filter((e) => overlaps(dayStart, dayEnd, e.startDp, e.endDp));
  }

  function isRangeFree(dateStr, startTime, endTime) {
    const s = toDpDate(dateStr, startTime);
    const e = toDpDate(dateStr, endTime);
    if (!(e > s)) return false;

    const existing = dayEvents(dateStr);
    return !existing.some((ev) => overlaps(s, e, ev.startDp, ev.endDp));
  }

  function startSlotEnabled(slot) {
    // A start slot is enabled if there exists at least one end slot later that creates a conflict-free range
    const idx = timeSlots.indexOf(slot);
    if (idx === -1) return false;

    for (let j = idx + 1; j < timeSlots.length; j++) {
      const endSlot = timeSlots[j];
      if (isRangeFree(apptDate, slot, endSlot)) return true;
    }
    return false;
  }

  function endSlotEnabled(slot) {
    if (!apptStart) return false;
    const startIdx = timeSlots.indexOf(apptStart);
    const endIdx = timeSlots.indexOf(slot);
    if (endIdx <= startIdx) return false;
    return isRangeFree(apptDate, apptStart, slot);
  }

  function openNuevaCita() {
    setApptTitle("Nueva cita");
    setApptDate(startDate.toString("yyyy-MM-dd")); // default to the currently selected day in the calendar
    setApptStart(null);
    setApptEnd(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function saveAppointment() {
    if (!apptStart || !apptEnd) return;
    if (!isRangeFree(apptDate, apptStart, apptEnd)) return;

    const start = toDpDate(apptDate, apptStart);
    const end = toDpDate(apptDate, apptEnd);

    setEvents((prev) => [
      ...prev,
      {
        id: DayPilot.guid(),
        text: apptTitle?.trim() || "Nueva cita",
        start,
        end,
      },
    ]);

    setIsModalOpen(false);
  }

  const canSave =
    !!apptStart &&
    !!apptEnd &&
    endSlotEnabled(apptEnd); // also implies no overlap

  // ---- Styles (inline to keep it simple) ----
  const styles = {
    toolbar: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
      marginBottom: 10,
      alignItems: "center",
    },
    timeSelectionContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr", // Side-by-side
      gap: 20,
      marginBottom: 10,
    },
    toolbarGroup: { display: "flex", gap: 8 },
    modalBackdrop: {
      height: "100%",
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: 16,
    },
    modal: {
      width: "min(720px, 96vw)",
      maxHeight: "90vh",      /* Keep it within 90% of screen height */
      overflowY: "auto",      /* Enable scrollbar if content is too tall */
      background: "#fff",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 20px 80px rgba(0,0,0,0.3)",
      position: "relative",   /* Good practice */
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 8, // Tighter margin
    },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontSize: 12, color: "#444" },
    input: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #ddd",
      outline: "none",
    },
    sectionTitle: { fontWeight: 700, margin: "10px 0 6px" },
    slotsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // 4 cols because they are side-by-side now
      gap: 4,
    },
    slotBtn: (enabled, selected) => ({
      padding: "6px 4px", // Smaller padding
      borderRadius: 8,
      border: "1px solid #ddd",
      cursor: enabled ? "pointer" : "not-allowed",
      background: selected ? "#111" : enabled ? "#fff" : "#e5e7eb",
      color: selected ? "#fff" : "#111",
      fontSize: "11px", // Smaller font
    }),
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
      marginTop: 14,
    },
    primary: (enabled) => ({
      padding: "10px 14px",
      borderRadius: 10,
      border: 0,
      cursor: enabled ? "pointer" : "not-allowed",
      background: enabled ? "#2563eb" : "#93c5fd",
      color: "#fff",
      fontWeight: 700,
    }),
    secondary: {
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid #ddd",
      background: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    },
    legend: { display: "flex", gap: 10, alignItems: "center", fontSize: 12, color: "#444", marginTop: 10 },
    swatch: (bg) => ({ width: 14, height: 14, borderRadius: 4, background: bg, border: "1px solid #ddd" }),
  };

  return (
    <div style={{
      height: "100vh",      /* Take up full screen height */
      display: "flex",      /* Enable flexbox */
      flexDirection: "column", 
      padding: "10px", 
      boxSizing: "border-box"
    }}>
      <div className="toolbar" style={styles.toolbar}>
        <div className="toolbar-group" style={styles.toolbarGroup}>
          <button onClick={() => setView("Day")} className={view === "Day" ? "selected" : ""}>Day</button>
          <button onClick={() => setView("Week")} className={view === "Week" ? "selected" : ""}>Week</button>
          <button onClick={() => setView("Month")} className={view === "Month" ? "selected" : ""}>Month</button>
        </div>

        <button onClick={openNuevaCita} className="new-appointment">
          + Nueva cita
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}> {/* This wrapper forces the calendar to fill the space */}

      {/* Day */}
        <DayPilotCalendar
          viewType="Day"
          visible={view === "Day"}
          startDate={startDate}
          events={events}
          width="100%"
          allowEventOverlap={false}
          onDateSelected={(args) => setStartDate(args.date)}
          
        />

        {/* Week */}
        <DayPilotCalendar
          viewType="Week"
          visible={view === "Week"}
          startDate={startDate}
          events={events}
          width="100%"
          allowEventOverlap={false}
          onDateSelected={(args) => setStartDate(args.date)}
        />

        {/* Month */}
        <DayPilotMonth
          visible={view === "Month"}
          startDate={startDate}
          events={events}
          width="100%"
          allowEventOverlap={false}
          onDateSelected={(args) => setStartDate(args.date)}
          heightSpec="Parent100Pct"
          
        />
      </div>
      {/* ---- Custom Modal ---- */}
      {isModalOpen && (
        <div style={styles.modalBackdrop} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Header and Inputs remain similar but tighter */}
            <div style={styles.modalHeader}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Nueva cita</div>
              <button style={styles.secondary} onClick={closeModal}>X</button>
            </div>

            <div style={styles.grid2}>
              <div style={styles.field}>
                <div style={styles.label}>Título</div>
                <input style={styles.input} value={apptTitle} onChange={(e) => setApptTitle(e.target.value)} />
              </div>
              <div style={styles.field}>
                <div style={styles.label}>Día</div>
                <input style={styles.input} type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)} />
              </div>
            </div>

            {/* NEW: Side-by-Side Grids */}
            <div style={styles.timeSelectionContainer}>
              <div>
                <div style={styles.sectionTitle}>Inicio</div>
                <div style={styles.slotsGrid}>
                  {timeSlots.map((slot) => (
                    <button 
                      key={slot} 
                      style={styles.slotBtn(startSlotEnabled(slot), apptStart === slot)}
                      onClick={() => { setApptStart(slot); setApptEnd(null); }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={styles.sectionTitle}>Fin</div>
                <div style={styles.slotsGrid}>
                  {timeSlots.map((slot) => (
                    <button 
                      key={slot} 
                      style={styles.slotBtn(endSlotEnabled(slot), apptEnd === slot)}
                      onClick={() => setApptEnd(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend and Footer stay at the bottom */}
            <div style={styles.legend}>...</div>
            <div style={styles.footer}>
              <button style={styles.primary(canSave)} onClick={saveAppointment} disabled={!canSave}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}