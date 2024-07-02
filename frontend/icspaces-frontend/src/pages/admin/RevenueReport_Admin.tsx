import React, { useEffect, useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Revenue_Dropdown from "../../components/Revenue_Dropdown";
import BackButton from "../../components/BackButton";
import { SleddingOutlined } from "@mui/icons-material";

interface Room {
  id: number;
  name: string;
}

interface Revenue {
  period: string;
  revenue: number;
  start_datetime: string;
  end_datetime: string;
  activity_name: string;
}

const SchedulesPage_Admin = () => {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);

  const handleRoomChange = (roomId: number) => {
    setSelectedRoom(roomId);
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
    console.log("Selected start date:", date ? date.format("YYYY-MM-DD") : "null");
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
    console.log("Selected end date:", date ? date.format("YYYY-MM-DD") : "null");
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
        if (roomData.length > 0) {
          setSelectedRoom(roomData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
  
    fetchRooms();
  }, []);
  
  useEffect(() => {
    const fetchRevenue = async () => {
      console.log("selectedRoom:", selectedRoom);

      let url = "http://localhost:3001/get-revenue-by-room-and-status";
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: selectedRoom,
          status_code: 2,
          start_date: startDate ? startDate.format("YYYY-MM-DD") : undefined,
          end_date: endDate ? endDate.format("YYYY-MM-DD") : undefined,
        }),
      };

      if (selectedRoom === -1) {
        url = "http://localhost:3001/get-revenue-by-room-and-status";
        options = {
          ...options,
          body: JSON.stringify({
            room_id: selectedRoom,
            status_code: 2,
            start_date: startDate ? startDate.format("YYYY-MM-DD") : undefined,
            end_date: endDate ? endDate.format("YYYY-MM-DD") : undefined,
          }),
        };
      }

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log("Revenue data:", data); // Print the data

        setRevenues(data);
      } catch (error) {
        console.error("Failed to fetch revenue:", error);
      }
    };

    fetchRevenue();
  }, [selectedRoom, startDate, endDate]);

  useEffect(() => {
    const fetchReservations = async () => {
      console.log("selectedRoom:", selectedRoom);

      let url = "http://localhost:3001/get-all-reservations-by-room-and-status";
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: selectedRoom,
          status_code: 2,
          start_date: startDate ? startDate.format("YYYY-MM-DD") : undefined,
          end_date: endDate ? endDate.format("YYYY-MM-DD") : undefined,
        }),
      };

      if (selectedRoom === null) {
        url = "http://localhost:3001/get-all-reservations-by-room-and-status";
        options = {
          ...options,
          body: JSON.stringify({
            status_code: 2,
            start_date: startDate ? startDate.format("YYYY-MM-DD") : undefined,
            end_date: endDate ? endDate.format("YYYY-MM-DD") : undefined,
          }),
        };
      }

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log("This is it", data); // Print the data

        // Ensure the response data is an array
        if (Array.isArray(data)) {
          setReservations(data);
        } else if (typeof data === 'object' && data !== null) {
          // If data is a single object, wrap it in an array
          setReservations([data]);
        } else {
          console.error("Unexpected response data:", data);
          setReservations([]); // Default to an empty array in case of unexpected data
        }
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
        setReservations([]);
      }
    };

    fetchReservations();
  }, [selectedRoom, startDate, endDate]);

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
              ICS Rooms Revenue Schedule
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={11}>
          <Box display="flex" justifyContent="space-between" gap={2}>
            <Revenue_Dropdown
              label="Choose Room"
              selectedOption={selectedRoom}
              handleSelectChange={handleRoomChange}
              rooms={rooms}
              width={900}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={11}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: { variant: "outlined", fullWidth: true }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: { variant: "outlined", fullWidth: true }
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={8} md={11} mt={2}>
          <Box display="flex">
            <Box
              width="50%"
              p={2}
              border={1}
              borderColor="grey.400"
              borderRadius={2}
              mr={2}
              style={{ height: 300, overflow: "auto" }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Revenue Data
              </Typography>
              {revenues.map((revenue, index) => (
                <Box key={index} p={1} border={1} borderColor="grey.200" borderRadius={2} mb={1}>
                  <Typography variant="body1">
                    {`Revenue ${index + 1}: ₱${revenue.revenue}`}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              width="50%"
              p={2}
              border={1}
              borderColor="grey.400"
              borderRadius={2}
              style={{ height: 300, overflow: "auto" }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Bookings from the selected date
              </Typography>
              {reservations.length > 0 ? (
                reservations.map((booking, index) => (
                  <Box key={index} p={1} border={1} borderColor="grey.200" borderRadius={2} mb={1} textAlign={"start"} >
                    <Typography variant="body1">
                      {`Booking ${index + 1}: ${booking.activity_name}, ${dayjs(booking.start_datetime).format('YYYY-MM-DD')} - ${dayjs(booking.end_datetime).format('YYYY-MM-DD')}`}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No reservations found.</Typography>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} mt={2}>
          {/* <RevenueReport_Admin reservations={revenues} /> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchedulesPage_Admin;
