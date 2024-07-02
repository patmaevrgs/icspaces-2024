import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

export default function FilterSchedule_Admin() {
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [startTime, setStartTime] = React.useState(dayjs());
  const [endTime, setEndTime] = React.useState(dayjs());
  const [selectedRoom, setSelectedRoom] = React.useState("");

  const rooms = ["Room 1", "Room 2", "Room 3"]; // Replace with your actual data

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value as string);
  };

  const refreshCalendar = () => {
    // Refresh calendar logic here
  };

  return (
    <Paper elevation={1} sx={{ maxWidth: "90%", margin: "auto" }}>
      <Grid container justifyContent="center">
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Grid item mr={7} sx={{ textAlign: "center" }}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel>Room</InputLabel>
              <Select
                value={selectedRoom}
                onChange={handleRoomChange}
                size="small"
              >
                {rooms.map((room, index) => (
                  <MenuItem key={index} value={room}>
                    {room}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid item mr={7}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setSelectedDate(newValue);
                  }
                }}
                sx={{ width: 200 }}
                slotProps={{ textField: { size: "small" } }}
              />
            </Grid>
            <Grid item mr={7}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setStartTime(newValue);
                  }
                }}
                sx={{ width: 200 }}
                slotProps={{ textField: { size: "small" } }}
              />
            </Grid>
            <Grid item mr={7}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => {
                  if (newValue !== null) {
                    setEndTime(newValue);
                  }
                }}
                sx={{ width: 200 }}
                slotProps={{ textField: { size: "small" } }}
              />
            </Grid>
          </LocalizationProvider>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={refreshCalendar}
              sx={{ width: 200, height: 40 }}
            >
              Refresh Calendar
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Paper>
  );
}
