import React, { useRef, useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BackButton from "../../components/BackButton";
import CloseIcon from "@mui/icons-material/Close";

interface Room {
  // image: string;
  room_id: string;
  room_name: string;
  // room_capacity: string;
  // fee: string;
  // room_type: string;
  // floor_number: string;
  // additional_fee_per_hour: string;
  // utilities: string[];
}
function GuestBookingForm_Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formValid, setFormValid] = useState(false);

  const [emailInfo, setEmailInfo] = useState({
    name: "",
    room: "",
    event_name: "",
    event_desc: "",
    date: "",
    time_start: "",
    time_end: "",
    other_details: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEmailInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, value: dayjs.Dayjs | null) => {
    setEmailInfo((prevState) => ({
      ...prevState,
      [name]: value ? value.format("MM-DD-YYYY") : "",
    }));
  };

  const [displayedEndTime, setDisplayedEndTime] = useState(emailInfo.time_end);
  const lastValidEndTime = useRef(emailInfo.time_end);

  const handleTimeChange = (
    name: string,
    value: string | number | dayjs.Dayjs | Date | null | undefined
  ) => {
    const timeValue = dayjs(value);
    if (
      name === "time_end" &&
      (timeValue.isBefore(dayjs(emailInfo.time_start, "hh:mm A")) ||
        timeValue.isSame(dayjs(emailInfo.time_start, "hh:mm A")))
    ) {
      // If the new end time is earlier or the same as the start time, show an alert and do not update the state
      alert("End time cannot be earlier or the same as the start time.");
      setDisplayedEndTime(lastValidEndTime.current);
    } else {
      // If the new end time is later than the start time, update the state and the last valid end time
      setEmailInfo((prevState) => ({
        ...prevState,
        [name]: value ? timeValue.format("hh:mm A") : "",
      }));
      if (name === "time_end") {
        lastValidEndTime.current = value ? timeValue.format("hh:mm A") : "";
        setDisplayedEndTime(value ? timeValue.format("hh:mm A") : "");
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Create a copy of emailInfo and delete the 'other_details' key
    const emailInfoCopy: { [key: string]: any } = { ...emailInfo };
    delete emailInfoCopy.other_details;

    // Check if any required fields are empty
    if (Object.values(emailInfoCopy).some((value) => value === "")) {
      // If any required field is empty, don't continue with submit
      alert("Please fill all required fields.");
    } else {
      // If all required fields are filled, continue with submit
      window.open(generateMailtoLink(), "_blank");
    }
  };

  const generateMailtoLink = () => {
    const {
      name,
      date,
      room,
      time_start,
      time_end,
      event_name,
      event_desc,
      other_details,
    } = emailInfo;
    const recipient = "icspacesdev@gmail.com"; //Replace this with admin's email
    const templateSubject = `ICSpaces Room Reservation Request - ${event_name}`;
    const templateEmail = `
      Hi, I am ${name} I would like to reserve a room for my event. 

      Below are the details:
      Event Name: ${event_name}
      Room: ${room}
      Description: ${event_desc}
      Date: ${date}
      Start Time: ${time_start}
      End Time: ${time_end}
      Additional Details: ${other_details}
    `;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(
      templateSubject
    )}&body=${encodeURIComponent(templateEmail)}`;

    // Once the mailto link is generated, open the dialog
    setIsDialogOpen(true);

    // Delay the opening of the dialog by 5 seconds
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 6000);

    // Automatically close the dialog after 5 seconds
    setTimeout(() => {
      setIsDialogOpen(false);
    }, 10000);

    return mailtoLink;
  };

  useEffect(() => {
    fetch("http://localhost:3001/get-all-rooms", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data), // Uncomment this line if you need to send data in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
        console.log(data);
      });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto", // Enable vertical scrolling
          height: "100vh", // Set the height to the full viewport height
        }}
      >
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle color="primary">
            Send Your Reservation Request
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please wait for the the Administrator's response regarding your
              request. Once your reservation is accepted, a Tracking ID will be
              emailed to you for tracking your reservation progress!
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Grid container spacing={3} mt={12} xs={10} mb={3}>
          <Grid item>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <BackButton />
              <Typography
                variant="h4"
                style={{ marginLeft: 20, color: "#183048", fontWeight: "bold" }}
              >
                Request Room Reservation
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="name"
              value={emailInfo.name}
              onChange={handleChange}
              label="Name"
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              name="room"
              value={emailInfo.room}
              onChange={handleChange}
              label="Room"
              fullWidth
            >
              {rooms.map((room) => (
                <MenuItem key={room.room_id} value={room.room_name}>
                  {room.room_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="event_name"
              value={emailInfo.event_name}
              onChange={handleChange}
              label="Event Name"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="event_desc"
              value={emailInfo.event_desc}
              onChange={handleChange}
              label="Event Description"
              rows={4}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <DatePicker
              name="date"
              value={emailInfo.date ? dayjs(emailInfo.date) : null}
              onChange={(newValue) => handleDateChange("date", newValue)}
              label="Date"
              format="MM/DD/YYYY"
              shouldDisableDate={(date) =>
                date.isBefore(dayjs().startOf("day"))
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TimePicker
              name="time_start"
              value={
                emailInfo.time_start
                  ? dayjs(emailInfo.time_start, "hh:mm A")
                  : null
              }
              onChange={(newValue) => handleTimeChange("time_start", newValue)}
              label="Start Time"
              minutesStep={60}
            />
          </Grid>
          <Grid item xs={4}>
            {/* <TimePicker
              name="time_end"
              value={
                emailInfo.time_end ? dayjs(emailInfo.time_end, "hh:mm A") : null
              }
              onChange={(newValue) => handleTimeChange("time_end", newValue)}
              label="End Time"
              minutesStep={60}
            /> */}
            <TimePicker
              name="time_end"
              value={dayjs(displayedEndTime)}
              onChange={(value) => handleTimeChange("time_end", value)}
              label="End Time"
              minutesStep={60}
            />
            {errorMessage && <p>{errorMessage}</p>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="other_details"
              value={emailInfo.other_details}
              onChange={handleChange}
              label="Other Details"
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              Submit via Email
            </Button>
          </Grid>
        </Grid>
      </div>
    </LocalizationProvider>
  );
}

export default GuestBookingForm_Page;
