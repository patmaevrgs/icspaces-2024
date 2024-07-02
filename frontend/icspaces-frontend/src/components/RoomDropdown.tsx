// RoomDropdown.tsx
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React, {useEffect, useState } from "react";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";

interface RoomDropdownProps {
  sx?: SxProps<Theme>;
  onRoomChange?: (roomId: number) => void; // Callback function to handle room change
}

interface Room {
  additional_fee_per_hour: string;
  fee: string;
  floor_number: number;
  room_capacity: number;
  room_id: number;
  room_name: string;
  room_type: string;
}

const RoomDropdown: React.FC<RoomDropdownProps> = ({ sx, onRoomChange }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | ''>('');

  useEffect(() => {
    fetch('http://localhost:3001/get-all-rooms', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(data), // Uncomment this line if you need to send data in the request body
    })
    .then(response => response.json())
    .then(data => {
      setRooms(data);
      console.log(data);
    });
  }, []);

const handleChange = (event: SelectChangeEvent<number>) => {
    setSelectedRoom(Number(event.target.value));
    onRoomChange?.(Number(event.target.value));
};

  return (
    <Select
      value={selectedRoom}
      onChange={handleChange}
      displayEmpty
      sx={{ width: "600px", ...sx }}
    >
      <MenuItem value="" disabled>
        Choose a room
      </MenuItem>
      {rooms.map(room => (
        <MenuItem key={room.room_id} value={room.room_id}>
          {room.room_name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default RoomDropdown;