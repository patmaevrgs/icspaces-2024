import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parseISO } from "date-fns";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

interface Reservation {
  activity_name: string;
  start_datetime: string;
  end_datetime: string;
  revenue: number;
}

interface Event {
  title: string;
  start: Date;
  end: Date;
  revenue: number;
}

interface CalendarSchedule_AdminProps {
  reservations: Reservation[];
}

const CalendarSchedule_Admin: React.FC<CalendarSchedule_AdminProps> = ({
  reservations,
}) => {
  const localizer = momentLocalizer(moment);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [open, setOpen] = useState(false);

  const events = reservations.map((reservation) => {
    const start = parseISO(reservation.start_datetime);
    const end = parseISO(reservation.end_datetime);

    return {
      title: `${reservation.activity_name} - Revenue: $${reservation.revenue}`,
      start: new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        start.getHours(),
        start.getMinutes()
      ),
      end: new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        end.getHours(),
        end.getMinutes()
      ),
      revenue: reservation.revenue,
    };
  });

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("events", events);

  return (
    <div style={{ height: "500px", fontFamily: "Inter" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        min={new Date(0, 0, 0, 7, 0)} // 7:00 AM
        max={new Date(0, 0, 0, 22, 0)} // 9:00 PM
        onSelectEvent={handleSelectEvent}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography variant="h6">{selectedEvent.title}</Typography>
              <Typography variant="body1">
                Start: {selectedEvent.start.toLocaleDateString()}{" "}
                {selectedEvent.start.toLocaleTimeString()}
              </Typography>
              <Typography variant="body1">
                End: {selectedEvent.end.toLocaleDateString()}{" "}
                {selectedEvent.end.toLocaleTimeString()}
              </Typography>
              <Typography variant="body1">
                Revenue: ${selectedEvent.revenue}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarSchedule_Admin;
