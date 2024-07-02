import React, { useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";

interface RoomNameCellProps {
  roomId: number;
}

const RoomNameCell: React.FC<RoomNameCellProps> = ({ roomId }) => {
  const [roomName, setRoomName] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomName = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-room-name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ room_id: roomId }),
        });
        const data = await response.json();
        setRoomName(data.roomName);
      } catch (error) {
        console.error("Failed to fetch room name:", error);
      }
    };

    fetchRoomName();
  }, [roomId]);

  return (
    <TableCell
      align="center"
      style={{ wordWrap: "break-word", maxWidth: "150px" }}
    >
      {roomName}
    </TableCell>
  );
};

export default RoomNameCell;
