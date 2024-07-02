import React, { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { CircularProgress, Grid, Stack, Typography } from "@mui/material";
import tempRoomPhoto from "../assets/room_images/ICS.jpg"; // Default image
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRoomFilter } from './RoomFilterContext';

interface Room {
  image: string;
  room_id: number;
  room_name: string;
  room_capacity: number;
  fee: string;
  room_type: string;
  floor_number: number;
  additional_fee_per_hour: string;
  utilities: string[];
}

const RoomList: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomImages, setRoomImages] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-all-rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const roomsData = await response.json();
        setRooms(roomsData);
        // Fetch images for each room
        roomsData.forEach((room: { room_id: any; }) => {
          fetchRoomImage(room.room_id);
        });
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load room data");
      } finally {
        setLoading(false);
      }
    };

    const fetchRoomImage = async (room_id: any) => {
      try {
        const response = await fetch("http://localhost:3001/get-room-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room_id: room_id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch room images");
        }

        const imageData = await response.json();
        if (imageData.success && imageData.images.length > 0) {
          setRoomImages(prevImages => ({
            ...prevImages,
            [room_id]: imageData.images[0].url
          }));
        }
      } catch (error) {
        console.error("Error fetching image for room ID:", room_id, error);
        setError("Failed to load room images");
      }
    };

    fetchRooms();
  }, []);

  const { selectedRoomTypes, selectedCapacities, selectedUtility, selectedFeeRange } = useRoomFilter();

  const feeRangeFilter = (fee: string) => {
    const feeNum = parseFloat(fee);
    if (selectedFeeRange.length === 0) return true; // No filter selected, show all
    return selectedFeeRange.some(range => {
      switch (range) {
        case "Below 1000":
          return feeNum < 1000;
        case "1001 - 3000":
          return feeNum >= 1001 && feeNum <= 3000;
        case "3000 Above":
          return feeNum > 3000;
        default:
          return true;
      }
    });
  };

  const capacityRangeFilter = (capacity: number) => {
    if (selectedCapacities.length === 0) return true;
    return selectedCapacities.some(capRange => {
      const [min, max] = capRange.split('-').map(Number);
      return capacity >= min && capacity <= max;
    });
  };
  

  const filteredRooms = rooms.filter(room =>
    (selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.room_type)) &&
    capacityRangeFilter(room.room_capacity) &&
    (selectedUtility === "" || room.utilities.some(utility => utility.toLowerCase().includes(selectedUtility.toLowerCase()))) &&
    feeRangeFilter(room.fee)
  );

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (filteredRooms.length === 0) return <Typography>No room matched your filters.</Typography>;

  return (
    <Stack>
      {filteredRooms.map((room, index) => (
        <Grid item key={index}>
          <RoomCard
            image={roomImages[room.room_id]}
            room_name={room.room_name}
            floor_number={room.floor_number.toString()}
            room_type={room.room_type}
            room_id={room.room_id.toString()}
            room_capacity={room.room_capacity.toString()}
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
