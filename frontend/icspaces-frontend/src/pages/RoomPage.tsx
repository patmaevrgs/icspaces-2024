import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Calendar from "../components/Calendar";
import HourButtons from "../components/HourButtons";
import dayjs, { Dayjs } from "dayjs";

const cell = {
  color: "white",
  backgroundColor: "#183048",
  border: "none",
  padding: "1px 15px",
  fontWeight: "bold",
};

const styles = {
  cell,
  boldCell: {
    ...cell,
    fontWeight: "normal",
    color: "white",
    backgroundColor: "#183048",
  },
  tableContainer: {
    border: "none",
    elevation: 0,
  },
  table: {
    border: "none",
  },
  tableCell: {
    border: "none",
  },
};

const styles_capacity = {
  cell: {
    color: "white",
    backgroundColor: "#183048",
    border: "none",
    padding: "1px 15px",
    fontWeight: "bold",
    marginBottom: '20px',
  },
};

const RoomPage = () => {
  const { room_id } = useParams<{ room_id: string }>();

  // State to keep track of the current image index and images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomImages, setRoomImages] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Handler to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % Object.keys(roomImages).length);
  };

  // Handler to go to the previous image
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + Object.keys(roomImages).length) % Object.keys(roomImages).length
    );
  };

  const statusMapping: Record<string, string> = {
    "0": "Ground",
    "1": "Second",
    "2": "Third",
    "3": "Fourth",
    // add other status codes as needed
  };

  const handleDateSelect = (selectedDate: Dayjs) => {
    // Do something with the selected date
    setSelectedDate(selectedDate);

    console.log("Selected Date:", selectedDate);
  };

  interface Room {
    additional_fee_per_hour: string;
    fee: string;
    floor_number: number;
    room_capacity: number;
    room_id: number;
    room_name: string;
    room_type: string;
  }

  interface Utility {
    fee: string;
    item_name: string;
    item_qty: number;
    room_id: number;
  }

  interface RoomInfo {
    room: Room;
    utility: Utility[];
  }

  interface ReservationsInfo {
    availableTimes: any;
  }

  const [room, setRoom] = useState<RoomInfo | null>();
  const [reservations, setReservations] = useState<ReservationsInfo | null>();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/get-available-room-time",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ room_id: room_id, date: selectedDate.format("YYYY-MM-DD")}),
          }
        );
        const data = await response.json();
        setReservations(data);
        console.log(reservations);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };
    fetchReservations();
  }, [selectedDate]);

  useEffect(() => {
    fetch("http://localhost:3001/get-room-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_id: room_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRoom(data);
        console.log(data);
      });
  }, [selectedDate]);

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const photos = await fetch(
          "http://localhost:3001/get-room-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ room_id }),
          }
        );
        if (!photos.ok) {
          throw new Error("Failed to fetch room images");
        }

        const imagesData = await photos.json();

        if (imagesData && imagesData.images && imagesData.images.length > 0) {
          const latestImage = imagesData.images[0].url;
          setRoomImages((prevImages) => ({
            ...prevImages,
            [room_id as string]: latestImage,
          }));
          console.log("Setting images successful");
        } 
      } catch (error) {
        console.error("Failed to fetch rooms and utilities:", error);
      }
    };
    getPhotos();
  }, [room_id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Aligns content to the top
        alignItems: "center", // Centers content horizontally
        height: "100vh", // Maintains full viewport height
        width: "200vh",
        overflowX: "hidden", // Prevents horizontal scrolling
        overflowY: "auto", // Allows scrolling
        position: "relative", // Allows positioning of children
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 560, 
          left: 230,
          width: 300, 
          height: 300,
        }}
      >
        <Calendar onDateSelect={handleDateSelect} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 560, 
          left: 680,
          width: 1700, 
          height: 700,
        }}
      >
        <HourButtons availableTimes={reservations?.availableTimes} dateTime={selectedDate} roomID={room_id}/>
      </Box>

      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ position: "absolute", top: 80, left: 20 }}
        variant="contained"
        onClick={() =>
          (window.location.href = "http://localhost:3000/viewroomspage")
        }
      >
        Back to ICS Rooms
      </Button>

      <Box sx={{ 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '70%', 
        marginRight: 4, 
        marginTop: 15,
      }}>
        <Button 
          sx={(theme) => ({
            position: "absolute", 
            left: `calc(-${theme.spacing(6)})`, 
            zIndex: 10,
            color: 'primary.main'
          })} 
          onClick={prevImage} 
          disabled={currentImageIndex === 0}
        >
          <ArrowBackIosIcon />
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', gap: 2, p: 2 }}>
          {roomImages[room_id as string] ? (
            <Box component="img"
              src={roomImages[room_id as string]}
              alt={`Room Image`}
              sx={{
                maxHeight: 400,
                borderRadius: 4,
                width: 'auto',
              }}
            />
          ) : (
            <Typography variant="h6" color="textSecondary">No images available</Typography>
          )}

          <Card sx={{
            width: 350,
            height: 400,
            backgroundColor: "#183048",
            borderRadius: 4,
          }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{
                fontWeight: "bold",
                color: "#FFB532",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}>
                {room?.room.room_name}
              </Typography>
              <Stack spacing={1} mt={2}>
                {/* Room details */}
                <TableContainer component={Paper} sx={{ border: "none", mb: 16 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell style={styles.boldCell}>Room type:</TableCell>
                        <TableCell style={styles.cell}>
                          {room?.room.room_type}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={styles.boldCell}>Location:</TableCell>
                        <TableCell style={styles.cell}>
                          {statusMapping[room?.room.floor_number ?? 3]}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={styles.boldCell}>Capacity:</TableCell>
                        <TableCell style={styles_capacity.cell}>
                          {room?.room.room_capacity}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography
                  color="text.secondary"
                  gutterBottom
                  align="left"
                  style={{ fontSize: "1rem" }}
                >
                  <span style={{ color: "white" }}>Available equipment:</span>
                </Typography>
                <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
                  {room?.utility?.map((utilityItem) => (
                    <li key={utilityItem.item_name}>
                      <Typography
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                        }}
                        align="left"
                      >
                        {`${utilityItem.item_name} (Qty: ${utilityItem.item_qty})`}
                      </Typography>
                    </li>
                  ))}
                </ul>
                <Typography
                  color="text.secondary"
                  gutterBottom
                  align="left"
                  style={{ fontSize: "1rem" }}
                >
                  <span style={{ color: "white" }}>Hourly Fee:</span>
                </Typography>
                <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
                  {[
                    `P ${parseInt(room?.room.fee ?? "")} / hour`,
                    `P ${parseInt(
                      room?.room.additional_fee_per_hour ?? ""
                    )} / hour overtime`,
                  ].map((fee) => (
                    <li key={fee}>
                      <Typography
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                        }}
                        align="left"
                      >
                        {fee}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        <Button 
          sx={(theme) => ({
            position: "absolute", 
            right: `calc(-${theme.spacing(6)})`, 
            zIndex: 10,
            color: 'primary.main'
          })} 
          onClick={nextImage} 
          disabled={currentImageIndex === Object.keys(roomImages).length - 1}
        >
          <ArrowForwardIosIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default RoomPage;
