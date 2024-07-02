import { TableRow, TableCell, Button } from "@mui/material";
import { Reservation } from "./types";

interface ReservationCardProps {
  reservation: Reservation;
  onClick: () => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onClick,
}) => {
  
  return (
    <TableRow key={reservation.id}>
      <TableCell align="center">{reservation.date}</TableCell>
      <TableCell align="center">{reservation.time}</TableCell>
      <TableCell align="center">{reservation.eventName}</TableCell>
      <TableCell align="center">{reservation.room}</TableCell>
      <TableCell align="center">{reservation.status}</TableCell>
      <TableCell align="center">
        <Button variant="contained" color="primary" onClick={onClick}>
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ReservationCard;
