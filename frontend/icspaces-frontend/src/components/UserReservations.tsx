import { useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import ReservationCard from "./ReservationCard";
import { Reservation, TransactionDetails } from "./types";
import ReservationsFilters from "./ReservationsFilters";

import './ReservationDialogForVerification';
import './ReservationDialogBooked';
import './ReservationDialogCancelled';
import './ReservationDialogDisapproved';
import './ReservationDialogForPayment';
import ReservationDialogBooked from "./ReservationDialogBooked";
import ReservationDialogForPayment from "./ReservationDialogForPayment";
import ReservationDialogCancelled from "./ReservationDialogCancelled";
import ReservationDialogDisapproved from "./ReservationDialogDisapproved";
import ReservationDialogForVerification from "./ReservationDialogForVerification";

import React from "react";


const UserReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "For Verification",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "For Payment",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "Cancelled",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "Disapproved",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "Booked",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "Booked",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "Booked",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "Booked",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    {
      id: "1",
      date: "2022-01-01",
      time: "10:00",
      eventName: "Event 1",
      room: "Room 1",
      status: "Booked",
      transactionDetails: {
        transactionId: "T1",
        date: "2022-01-01",
        status: "Completed",
        comment: "Admin comment 1",
      },
    },
    // Add more dummy reservations here...
  ]);



  
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const handleOpen = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setOpen(true);
  };

  return (
    <Stack
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "6px",
        width: "80%",
      }}
    >
      <ReservationsFilters />

      <TableContainer
        component={Paper}
        style={{
          maxWidth: "100%",
          maxHeight: "400px",
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="center">Event Name</TableCell>
              <TableCell align="center">Room</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onClick={() => handleOpen(reservation)}
            />
          ))}
        </Table>

        {/* Select reservation based on status */}
        {/* {selectedReservation && ((() => {
          switch (selectedReservation.status) {
            case "For Verification":
              return <ReservationDialogForVerification open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>;
            case "For Payment":
              return <ReservationDialogForPayment open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>;
            case "Cancelled":
              return <ReservationDialogCancelled open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>;
            case "Disapproved":
              return <ReservationDialogDisapproved open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>;
            default:
              return <ReservationDialogBooked open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>;
          }})()
        )} */}

      </TableContainer>
    </Stack>
  );
};

export default UserReservations;
