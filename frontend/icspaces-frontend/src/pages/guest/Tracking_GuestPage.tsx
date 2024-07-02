import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Modal,
  DialogContent,
  Dialog,
  DialogTitle,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { format } from "date-fns";
import BackButton from "../../components/BackButton";
import RoomNameCell from "../../components/RoomNameCell";
import CloseIcon from "@mui/icons-material/Close";

interface ReservationDialogForVerificationProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation;
}

interface Reservation {
  activity_name: string;
  additional_fee: string;
  date_created: string;
  discount: string;
  end_datetime: string;
  room_id: string;
  start_datetime: string;
  status_code: string;
  total_amount_due: string;
  user_id: string;
  room_name: string;
  // add other fields as needed
}

const statusMapping: Record<string, string> = {
  "0": "Pending",
  "1": "For Payment",
  "2": "Approved",
  "3": "Rejected",
  "4": "Cancelled",
  // add other status codes as needed
};

const statusColorMapping: Record<string, string> = {
  "0": "#eca517", // light yellow
  "1": "#57b5d4", // light blue
  "2": "#18bd8e", // light green
  "3": "#fb0606", // light red
  "4": "#828282", // light grey
  // add other status codes as needed
};

type Comment = {
  comment_id: number;
  reservation_id: number;
  user_id: string;
  comment_text: string;
  date_created: string;
};

const ReservationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataTable, setDataTable] = useState<Reservation[]>([]);
  const [originalData, setOriginalData] = useState<Reservation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showModal, setShowModal] = useState(false);

  var reservationNotFound = false;
  const handleSearchChange = (event: { target: { value: any } }) => {
    const search = event.target.value;

    setSearchTerm(search);
    if (search !== "") {
      fetch("http://localhost:3001/track-guest-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_id: search }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch reservation");
            reservationNotFound = true;
          }
          return response.json();
        })
        .then((data) => {
          setDataTable([data.data]);
          setComments(data.comments.flat());
          console.log("COMM", data.comments);
        })

        .catch((error) => {
          console.error(error);
          setDataTable([]);
        });
    } else {
      setDataTable([]);
    }
  };
  console.log("DATA", dataTable);
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  console.log("COMMENT", comments);
  console.log("first comment:", comments[0]);

  return (
    <div style={{ maxWidth: "95%", margin: "0 auto" }}>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "100px",
          marginBottom: "30px",
        }}
      >
        <BackButton />
        <Typography
          variant="h4"
          style={{ marginLeft: 20, color: "#183048", fontWeight: "bold" }}
        >
          My Room Reservations
        </Typography>
      </Box>

      <Paper
        style={{
          width: "auto",
          maxHeight: 540,
          overflow: "auto",
          padding: 20,
          margin: "auto",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <TextField
            label="Search Tracking ID"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">DATE</TableCell>
                <TableCell align="center">TIME</TableCell>
                <TableCell align="center">ROOM</TableCell>
                <TableCell align="center">EVENT NAME</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="center">ADMIN'S COMMENT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTable.length > 0 ? ( //IF MAY ERROR,
                dataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {format(new Date(row.start_datetime), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell align="center">
                      {`${format(
                        new Date(row.start_datetime),
                        "hh:mm a"
                      )} - ${format(new Date(row.end_datetime), "hh:mm a")}`}
                    </TableCell>
                    <RoomNameCell roomId={parseInt(row.room_id)} />
                    <TableCell align="center">{row.activity_name}</TableCell>
                    <TableCell
                      align="center"
                      style={{
                        wordWrap: "break-word",
                        maxWidth: "150px",
                        color: statusColorMapping[row.status_code],
                      }}
                    >
                      <b>{statusMapping[row.status_code]}</b>
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="contained" onClick={handleOpenModal}>
                        View Comment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Please enter a valid tracking ID.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle color="primary" sx={{ fontWeight: "bold" }}>
          Admin's comment
          <IconButton
            style={{ position: "absolute", right: "8px", top: "8px" }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 0.5,
              borderRadius: "8px",
            }}
          >
            {comments.length > 0 && (
              <Box>
                <Typography variant="body2">
                  {new Date(comments[0].date_created).toLocaleString()}
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  {comments[0].comment_text}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationsPage;
