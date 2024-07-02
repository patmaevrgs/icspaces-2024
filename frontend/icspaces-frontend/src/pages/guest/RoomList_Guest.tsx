import React, { useEffect, useState } from 'react';
import RoomCardGuest from "./RoomCard_Guest";
import { Grid, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Default image URL
const DEFAULT_IMAGE_URL = "../path/to/default/image.jpg"; // Update this path

interface Room {
  image: string;
  room_id: string;
  room_name: string;
  room_capacity: string;
  fee: string;
  room_type: string;
  floor_number: string;
  additional_fee_per_hour: string;
  utilities: string[];
}

const RoomList: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/get-all-rooms', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log("Rooms data fetched:", data); // Log rooms data
      const updatedRooms = data.map(async (room: Room) => { // Specify type here
        const imageResponse = await fetch('http://localhost:3001/get-room-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ room_id: room.room_id }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          console.log(`Image data for room ${room.room_id}:`, imageData); // Log image data
          if (imageData && imageData.images && imageData.images.length > 0) {
            room.image = imageData.images[0]; // Using the first image
          } else {
            room.image = DEFAULT_IMAGE_URL; // No image found, use default
          }
        } else {
          room.image = DEFAULT_IMAGE_URL; // Fetch failed, use default
        }

        return room;
      });

      Promise.all(updatedRooms).then(roomsWithImages => {
        console.log("Rooms with images:", roomsWithImages); // Log final rooms data with images
        setRooms(roomsWithImages);
      });
    });
  }, []);

  return (
    <Stack>
      {rooms.map((room, index) => (
        <Grid item key={index}>
          <RoomCardGuest
            image={room.image}
            room_name={room.room_name}
            floor_number={room.floor_number}
            room_type={room.room_type} 
            room_id={room.room_id} 
            room_capacity={room.room_capacity} 
            fee={room.fee} 
            additional_fee_per_hour={room.additional_fee_per_hour}  
            utilities={room.utilities}
          />
        </Grid>
      ))}
    </Stack>
  );
};

export default RoomList;
