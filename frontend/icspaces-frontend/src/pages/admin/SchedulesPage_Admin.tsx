import React, { useEffect, useState } from "react";
import DropDown_Admin from "../../components/DropDown_Admin";
import DateSchedule_Admin from "../../components/DateSchedule_Admin";
import { SelectChangeEvent, Typography } from "@mui/material";
import { Grid, Box } from "@mui/material";
import FilterSchedule_Admin from "../../components/FilterSchedule_Admin";
import CalendarSchedule_Admin from "../../components/CalendarSchedule_Admin";
import PrintSched_Admin from "../../components/PrintSched_Admin";
import BackButton from "../../components/BackButton";

interface Room {
  id: number;
  name: string;
}

interface Reservation {
  end_datetime: any;
  start_datetime: any;
  activity_name: any;
  // Define your reservation properties here
}

const SchedulesPage_Admin = () => {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const handleRoomChange = (roomId: number) => {
    setSelectedRoom(roomId);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-all-rooms", {
          method: "POST",
        });
        const data = await response.json();
        const roomData = data.map((room: any) => ({
          id: room.room_id,
          name: room.room_name,
        }));
        setRooms(roomData);
        console.log(roomData);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      console.log("selectedRoom:", selectedRoom);

      if (selectedRoom != null) {
        try {
          let url = "";
          let options = {};

          if (selectedRoom === -1) {
            url = "http://localhost:3001/get-all-reservation";
            options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            };
          } else {
            url = "http://localhost:3001/get-all-reservations-by-room";
            options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ room_id: selectedRoom }),
            };
          }

          const response = await fetch(url, options);
          const data = await response.json();
          console.log("This is it", data); // Print the data

          setReservations(data);
        } catch (error) {
          console.error("Failed to fetch reservations:", error);
        }
      }
    };

    fetchReservations();
  }, [selectedRoom]);

  const reservationData = reservations.map((reservation) => ({
    activity_name: reservation.activity_name,
    start_datetime: reservation.start_datetime,
    end_datetime: reservation.end_datetime,
  }));

  return (
    <Box style={{ overflow: "auto", height: "calc(100vh - 2vh)" }}>
      <Grid container justifyContent="center" spacing={2} mt={7} mb={5}>
        <Grid item md={11} mb={3} mt={2}>
          <Box display="flex" alignItems="flex-start">
            <BackButton />
            <Typography
              variant="h4"
              ml={2}
              color="primary"
              style={{ fontWeight: "bold" }}
            >
              ICS Rooms Schedule
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={11}>
          <Box display="flex" justifyContent="space-between" gap={2}>
            <DropDown_Admin
              label="Choose Room"
              selectedOption={selectedRoom}
              handleSelectChange={handleRoomChange}
              rooms={rooms}
              width={900}
            />
            {/* <PrintSched_Admin /> */}
          </Box>
        </Grid>
        <Grid item xs={12} mt={-2}>
          <CalendarSchedule_Admin reservations={reservationData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchedulesPage_Admin;
