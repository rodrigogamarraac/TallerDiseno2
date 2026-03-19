import React, { useMemo, useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { supabase } from "./supabaseClient.js";

export default function Calendar() {
  const [view, setView] = useState("Week");
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const handleEventClick = (args) => {
    args.preventDefault?.();          // stops default click behavior
    console.log("Event clicked:", args.e.data);
    openEditModalFromEvent(args.e);
  };

  const [events, setEvents] = useState([
    {
      id: 1,
      text: "Appointment - John",
      start: "2026-03-03T10:00:00",
      end: "2026-03-03T11:00:00",
    },
  ]);

  function isoToLocalNaive(iso) {
    const d = new Date(iso); // parses UTC/offset correctly
    const pad = (n) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
          `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // ---- Modal state ----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apptTitle, setApptTitle] = useState("Nueva cita");
  const [apptDate, setApptDate] = useState(startDate.toString("yyyy-MM-dd"));
  const [apptStart, setApptStart] = useState(null); // "HH:mm"
  const [apptEnd, setApptEnd] = useState(null); // "HH:mm"
  const [editingId, setEditingId] = useState(null); // null = creating, otherwise editing existing appointment

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id, title, start_time, end_time")
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Load appointments error:", error);
        return;
      }

      setEvents(
        (data ?? []).map((row) => ({
          id: row.id,
          text: row.title,
          start: isoToLocalNaive(row.start_time),
          end: isoToLocalNaive(row.end_time),
        }))
      );
    })();
  }, []);

  // Business hours (change if you want)
  const BUSINESS_START = 8; // 08:00
  const BUSINESS_END = 20; // 20:00 (last start slot is 19:30)

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = BUSINESS_START; h < BUSINESS_END; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  function toDpDate(dateStr, timeStr) {
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

  function isRangeFree(dateStr, startTime, endTime, ignoreId = null) {
    const s = toDpDate(dateStr, startTime);
    const e = toDpDate(dateStr, endTime);
    if (!(e > s)) return false;

    const existing = dayEvents(dateStr).filter((ev) => ev.id !== ignoreId);
    return !existing.some((ev) => overlaps(s, e, ev.startDp, ev.endDp));
  }

  function startSlotEnabled(slot) {
    const idx = timeSlots.indexOf(slot);
    if (idx === -1) return false;

    for (let j = idx + 1; j < timeSlots.length; j++) {
      const endSlot = timeSlots[j];
      if (isRangeFree(apptDate, slot, endSlot, editingId)) return true;
    }
    return false;
  }

  function endSlotEnabled(slot) {
    if (!apptStart) return false;
    const startIdx = timeSlots.indexOf(apptStart);
    const endIdx = timeSlots.indexOf(slot);
    if (endIdx <= startIdx) return false;
    return isRangeFree(apptDate, apptStart, slot, editingId);
  }

  function openNuevaCita() {
    setEditingId(null);
    setApptTitle("Nueva cita");
    setApptDate(startDate.toString("yyyy-MM-dd"));
    setApptStart(null);
    setApptEnd(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
  }

  function moveRange(direction) {
  // direction: -1 (left arrow), +1 (right arrow)

    setStartDate((prev) => {
      if (view === "Day") {
        return prev.addDays(1 * direction);
      }
      if (view === "Week") {
        return prev.addDays(7 * direction);
      }
      // Month
      return prev.firstDayOfMonth().addMonths(1 * direction);
    });
  }

  async function saveAppointment() {
    if (!apptStart || !apptEnd) return;
    if (!isRangeFree(apptDate, apptStart, apptEnd, editingId)) return;

    const startISO = new Date(`${apptDate}T${apptStart}:00`).toISOString();
    const endISO = new Date(`${apptDate}T${apptEnd}:00`).toISOString();

    const payload = {
      title: apptTitle?.trim() || "Nueva cita",
      start_time: startISO,
      end_time: endISO,
      // user_id: userId, // only if your RLS policies require it
    };

    // EDIT existing
    if (editingId) {
      const { data, error } = await supabase
        .from("appointments")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        console.error("Update appointment error:", error);
        return;
      }

      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? {
                ...e,
                text: data.title,
                start: isoToLocalNaive(data.start_time),
                end: isoToLocalNaive(data.end_time),
              }
            : e
        )
      );

      setIsModalOpen(false);
      setEditingId(null);
      return;
    }

    // CREATE new
    const { data, error } = await supabase
      .from("appointments")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Insert appointment error:", error);
      return;
    }

    setEvents((prev) => [
      ...prev,
      { id: data.id, text: data.title, start: isoToLocalNaive(data.start_time), end: isoToLocalNaive(data.end_time) },
    ]);

    setIsModalOpen(false);
  }

  

  const canSave = !!apptStart && !!apptEnd && endSlotEnabled(apptEnd);

  function dpToLocalParts(value) {
    // value can be string or DayPilot.Date
    const s = typeof value === "string"
      ? value
      : value.toString("yyyy-MM-ddTHH:mm:ss"); // DayPilot.Date -> string

    return {
      date: s.slice(0, 10),      // "YYYY-MM-DD"
      time: s.slice(11, 16),     // "HH:mm"
    };
  }

  function openEditModalFromEvent(dpEvent) {
    const data = dpEvent.data;         // DayPilot.Event.data
    const id = dpEvent.id();           // event id
    const title = dpEvent.text();      // event text

    const startParts = dpToLocalParts(data.start);
    const endParts = dpToLocalParts(data.end);

    setEditingId(id);
    setApptTitle(title);
    setApptDate(startParts.date);
    setApptStart(startParts.time);
    setApptEnd(endParts.time);
    setIsModalOpen(true);
  }

  async function deleteAppointment() {
    if (!editingId) return;

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", editingId);

    if (error) {
      console.error("Delete appointment error:", error);
      return;
    }

    setEvents((prev) => prev.filter((e) => e.id !== editingId));
    setIsModalOpen(false);
    setEditingId(null);
  }

  return (
    <div className="calendar-page">
      <div className="toolbar">
        <div className="toolbar-left">
          <button className="nav-arrow" onClick={() => moveRange(-1)} aria-label="Previous">
            ◀
          </button>

          <div className="toolbar-group">
            <button onClick={() => setView("Day")} className={view === "Day" ? "selected" : ""}>
              Day
            </button>
            <button onClick={() => setView("Week")} className={view === "Week" ? "selected" : ""}>
              Week
            </button>
            <button onClick={() => setView("Month")} className={view === "Month" ? "selected" : ""}>
              Month
            </button>
          </div>

          <button className="nav-arrow" onClick={() => moveRange(1)} aria-label="Next">
            ▶
          </button>
        </div>

        <button onClick={openNuevaCita} className="new-appointment">
          + Nueva cita
        </button>
      </div>

      <div className="calendar-content">
        {/* Day */}
        <DayPilotCalendar
          viewType="Day"
          visible={view === "Day"}
          startDate={startDate}
          events={events}
          width="100%"
          eventClickHandling="Enabled"
          onEventClick={handleEventClick}
        />

        <DayPilotCalendar
          viewType="Week"
          visible={view === "Week"}
          startDate={startDate}
          events={events}
          width="100%"
          eventClickHandling="Enabled"
          onEventClick={handleEventClick}
        />

        <DayPilotMonth
          visible={view === "Month"}
          startDate={startDate}
          events={events}
          width="100%"
          heightSpec="Parent100Pct"
          eventClickHandling="Enabled"
          onEventClick={handleEventClick}
        />
      </div>

      {/* ---- Custom Modal ---- */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Nueva cita</div>
              <button className="btn-secondary" onClick={closeModal}>
                X
              </button>
            </div>

            <div className="grid2">
              <div className="field">
                <div className="label">Paciente</div>
                <input className="input" value={apptTitle} onChange={(e) => setApptTitle(e.target.value)} />
              </div>
              <div className="field">
                <div className="label">Día</div>
                <input className="input" type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)} />
              </div>
            </div>

            <div className="timeSelectionContainer">
              <div>
                <div className="sectionTitle">Inicio</div>
                <div className="slotsGrid">
                  {timeSlots.map((slot) => {
                    const enabled = startSlotEnabled(slot);
                    const selected = apptStart === slot;
                    const cls = `slotBtn${enabled ? "" : " disabled"}${selected ? " selected" : ""}`;

                    return (
                      <button
                        key={slot}
                        className={cls}
                        onClick={() => {
                          setApptStart(slot);
                          setApptEnd(null);
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="sectionTitle">Fin</div>
                <div className="slotsGrid">
                  {timeSlots.map((slot) => {
                    const enabled = endSlotEnabled(slot);
                    const selected = apptEnd === slot;
                    const cls = `slotBtn${enabled ? "" : " disabled"}${selected ? " selected" : ""}`;

                    return (
                      <button key={slot} className={cls} onClick={() => setApptEnd(slot)}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="legend">...</div>

            <div className="footer">
              {editingId && (
                <button className="btn-danger" onClick={deleteAppointment}>
                  Eliminar
                </button>
              )}

              <button
                className={`btn-primary${canSave ? "" : " disabled"}`}
                onClick={saveAppointment}
                disabled={!canSave}
              >
                {editingId ? "Guardar cambios" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}