import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

import roomImages from "../../assets/room_images/RoomImages";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BackButton from "../../components/BackButton";
import RoomPhotos from "../../components/RoomPhotos";

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

const RoomsPage_Admin = () => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [image, setImage] = useState<{ [key: number]: string }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const nextRoom = () => {
    setCurrentRoom((prevIndex) => (prevIndex + 1) % rooms.length);
  };
  const prevRoom = () => {
    setCurrentRoom(
      (prevIndex) => (prevIndex - 1 + rooms.length) % rooms.length
    );
  };
  const statusMapping: Record<string, string> = {
    "0": "Ground Floor",
    "1": "Second Floor",
    "2": "Third Floor",
    "3": "Fourth Floor",
    // add other status codes as needed
  };

  interface Utility {
    fee: string;
    item_name: string;
    item_qty: number;
    room_id: number;
  }

  interface RoomInfo {
    id: number;
    name: string;
    capacity: number;
    fee: string;
    type: string;
    isDeleted: boolean;
    floor_number: number;
    additional_fee_per_hour: string;
    utilityData: Utility[];
  }
  
  const deleteRoom = () => {
    const confirmed = window.confirm("Are you sure you want to delete this page?");
    if (confirmed){
      try {
        fetch("http://localhost:3001/delete-room", {
          method: "POST",
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({room_id: rooms[currentRoom]?.id, admin_id: userEmail}),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {console.log(data);window.location.reload();})
      } catch (error) {
        console.error("Error deleting room:", error);
      }
      
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        if (data.success) {
          setUserEmail(data.data.email);
          console.log(userEmail);
        }

      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    }
    fetchUserProfile();
  }, [])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-all-rooms-complete", {
          method: "POST",
        });
        const data = await response.json();
        const roomData = data.map((room: any) => ({
          id: room.room_id,
          name: room.room_name,
          capacity: room.room_capacity,
          fee: room.fee,
          type: room.room_type,
          floor_number: room.floor_number,
          isDeleted: room.isDeleted,
          additional_fee_per_hour: room.additional_fee_per_hour,
          utilityData: room.utilities.map((utility:any) => ({
            fee: utility.fee,
            item_name: utility.item_name,
            item_qty: utility.item_qty,
          })),
        }));
        setRooms(roomData);
        console.log(roomData);
        
      } catch (error) {
        console.error("Failed to fetch rooms and utilities:", error);
      }
    };

    fetchRooms();
  }, []);

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
            body: JSON.stringify({ room_id: rooms[currentRoom]?.id }),
          }
        );
        if (!photos.ok) {
          throw new Error("Failed to fetch room images");
        }

        const imagesData = await photos.json();

        if (imagesData && imagesData.images && imagesData.images.length > 0) {
          const latestImage = imagesData.images[0].url;
          setImage((img:any)=>({
            ...img,
            [rooms[currentRoom]?.id]: latestImage,
          }));
          console.log("setting images successful");
        } 
      }catch (error) {
        console.error("Failed to fetch rooms and utilities:", error);
      }
    }
    getPhotos();
  }, [rooms, currentRoom]);
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: 560, md: 560 },
          left: { xs: 10, md: 230 },
          width: "66%",
          height: 300,
        }}
      >
        <RoomPhotos roomID={rooms[currentRoom]?.id} />
      </Box>
  
      <Box
        sx={{
          position: "absolute",
          top: { xs: 20, md: 80 },
          left: { xs: 10, md: 40 },
        }}
      >
        <BackButton />
      </Box>
  
      <Box
        component="img"
        src={`${image[rooms[currentRoom]?.id]}`}
        alt={`Room Image ${currentRoom + 1}`}
        sx={{
          maxHeight: 400,
          borderRadius: 4,
          position: "absolute",
          top: { xs: 100, sm: 100, md: 140 },
          left: { xs: 20, sm: 40, md: 250 },
          width: { xs: "80%", md: "auto" }, 
          height: { xs: "auto", md: 400 },
        }}
      />
  
      <Button
        sx={{
          position: "absolute",
          top: { xs: 520, sm: 270, md: 320 },
          left: { xs: 90, sm: 0, md: 200 },
        }}
        onClick={prevRoom}
        disabled={currentRoom === 0}
      >
        <ArrowBackIosIcon />
      </Button>
  
      <Button
        sx={{
          position: "absolute",
          top: { xs: 520, sm: 270, md: 320 },
          left: { xs: 130, sm: 670, md: 1180 },
        }}
        onClick={nextRoom}
        disabled={currentRoom === rooms.length - 1}
      >
        <ArrowForwardIosIcon />
      </Button>
  
      <Card
        sx={{
          width: { xs: "72%", sm: 250, md: 320 },
          height: { xs: "40%", sm: 317, md: 370 },
          position: "absolute",
          top: { xs: 350, sm: 273, md: 340 },
          left: { xs: 190, sm: 550,  md: 1000 },
          transform: "translate(-50%, -50%)",
          p: 2,
          backgroundColor: "#183048",
          borderRadius: 4,
          overflowY: "auto",    
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#FFB532",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {rooms[currentRoom]?.name}
          </Typography>
          <Stack spacing={1} mt={2}>
            <TableContainer component={Paper} sx={{ border: "none", mb: 16 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell style={styles.boldCell}>Room type:</TableCell>
                    <TableCell style={styles.cell}>
                      {rooms[currentRoom]?.type}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={styles.boldCell}>Location:</TableCell>
                    <TableCell style={styles.cell}>
                      {statusMapping[rooms[currentRoom]?.floor_number ?? 3]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={styles.boldCell}>Capacity:</TableCell>
                    <TableCell style={styles.cell}>
                      {rooms[currentRoom]?.capacity}
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
              {rooms[currentRoom]?.utilityData?.map((utilityItem) => (
                <li key={utilityItem.item_name}>
                  <Typography
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                    }}
                    align="left"
                  >
                    - {utilityItem.item_name}
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
                `P ${parseInt(rooms[currentRoom]?.fee ?? "")} / hour`,
                `P ${parseInt(
                  rooms[currentRoom]?.additional_fee_per_hour ?? ""
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
            <Stack direction="row" spacing={2} alignContent="center">
              <Button
                variant="contained"
                component={Link}
                to={`/editroominfopage_admin/${rooms[currentRoom]?.id}`}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#FFB532",
                  height: "23px",
                  width: "40%",
                  color: "black",
                  borderRadius: "20px",
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor: "#FFC532",
                  },
                }}
              >
                {" "}
                Edit{" "}
              </Button>
              <Button
                variant="contained"
                onClick={deleteRoom}
                sx={{
                  backgroundColor: "red",
                  textTransform: "none",
                  height: "23px",
                  width: "40%",
                  color: "black",
                  borderRadius: "20px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: "#aa0000",
                  },
                  ml: 2,
                }}
              >
                {" "}
                Delete{" "}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
  
};

export default RoomsPage_Admin;