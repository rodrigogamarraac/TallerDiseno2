import React, { useMemo, useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { supabase } from "./supabaseClient.js";

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

  function isRangeFree(dateStr, startTime, endTime) {
    const s = toDpDate(dateStr, startTime);
    const e = toDpDate(dateStr, endTime);
    if (!(e > s)) return false;

    const existing = dayEvents(dateStr);
    return !existing.some((ev) => overlaps(s, e, ev.startDp, ev.endDp));
  }

  function startSlotEnabled(slot) {
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
    setApptDate(startDate.toString("yyyy-MM-dd"));
    setApptStart(null);
    setApptEnd(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
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
    if (!isRangeFree(apptDate, apptStart, apptEnd)) return;

    // Use browser-local time -> store as ISO (UTC) in DB
    const startISO = new Date(`${apptDate}T${apptStart}:00`).toISOString();
    const endISO = new Date(`${apptDate}T${apptEnd}:00`).toISOString();

    // If you used Option A (Auth + RLS), you MUST include user_id:
    // const { data: userResp } = await supabase.auth.getUser();
    // const userId = userResp?.user?.id;

    const payload = {
      title: apptTitle?.trim() || "Nueva cita",
      start_time: startISO,
      end_time: endISO,
      // user_id: userId, // <- enable if using Auth+RLS
    };

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
      {
        id: data.id,
        text: data.title,
        start: isoToLocalNaive(data.start_time),
        end: isoToLocalNaive(data.end_time),
      },
    ]);

    setIsModalOpen(false);
  }

  const canSave = !!apptStart && !!apptEnd && endSlotEnabled(apptEnd);

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
              <button className={`btn-primary${canSave ? "" : " disabled"}`} onClick={saveAppointment} disabled={!canSave}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}