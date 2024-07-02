import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Box,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { format } from "date-fns";
import BackButton from "../../components/BackButton";
import RoomNameCell from "../../components/RoomNameCell";
import { ReservationDataForModal } from "../../components/types";
import ReservationDialogForPaymentAdmin from "../../components/ReservationDialogForPaymentAdmin";
import ReservationDialogCancelled from "../../components/ReservationDialogCancelled";
import ReservationDialogDisapproved from "../../components/ReservationDialogDisapproved";
import ReservationDialogBooked from "../../components/ReservationDialogBooked";
import ReservationDialogForVerificationAdmin from "../../components/ReservationDialogForVerificationAdmin";

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
  reservation_id: string;
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
  "2": "Booked",
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

const ReservationsPage = () => {
  const [reservationView, setReservationView] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataTable, setDataTable] = useState<Reservation[]>([]);
  const [originalData, setOriginalData] = useState<Reservation[]>([]);
  const [roomName, setRoomName] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/get-all-reservation", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(data), // Uncomment this line if you need to send data in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        setDataTable(data);
        setOriginalData(data);
        console.log(data);
      });
  }, []);

  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDataForModal | null>(null);

  const handleOpen = (reservationDataForModal: ReservationDataForModal) => {
    setSelectedReservation(reservationDataForModal);
    setOpen(true);
  };

  const handleViewChange = (event: { target: { value: any } }) => {
    const view = event.target.value;
    setReservationView(view);
    applyFilters(view, searchTerm);
  };

  const handleSearchChange = (event: { target: { value: any } }) => {
    const search = event.target.value;
    setSearchTerm(search);
    applyFilters(reservationView, search);
  };

  const handleItemsPerPageChange = (event: { target: { value: any } }) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page if items per page change
  };

  const applyFilters = (view: string, search: string) => {
    let filteredData = originalData;
    if (view !== "all") {
      filteredData = filteredData.filter(
        (row) => statusMapping[row.status_code] === view
      );
    }
    if (search) {
      filteredData = filteredData.filter((row) =>
        row.activity_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setDataTable(filteredData);
  };

  const formatDateTime = (dateTimeString: string): string => {
    if (dateTimeString == "") return "";

    const date = new Date(dateTimeString);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const month = months[date.getMonth()];
    const dayNumber = date.getDate();
    const year = date.getFullYear();
    const dayOfWeek = days[date.getDay()];
    const hour = date.getHours() % 12 || 12; // Convert 0 to 12
    const minute = date.getMinutes();
    const ampm = date.getHours() < 12 ? "AM" : "PM";

    return `${month} ${dayNumber}, ${year}, ${dayOfWeek}, ${hour}:${
      minute < 10 ? "0" + minute : minute
    } ${ampm}`;
  };

  // Function to extract reserve day (day of the week) from a given date-time string
  const extractReserveDayDayString = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
    };
    return date.toLocaleString("en-US", options);
  };

  // Function to extract reserve day number from a given date-time string
  const extractReserveDayNumber = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.getDate().toString().length == 1
      ? `0${date.getDate().toString()}`
      : date.getDate().toString();
  };

  // Function to extract reserve month from a given date-time string
  const extractReserveMonth = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
    };
    return date.toLocaleString("en-US", options);
  };

  // Function to extract reserve year from a given date-time string
  const extractReserveYear = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.getFullYear().toString();
  };

  // Function to calculate hours used
  const calculateHoursUsed = (
    startDateTimeString: string,
    endDateTimeString: string
  ): string => {
    const startDate = new Date(startDateTimeString);
    const endDate = new Date(endDateTimeString);

    // Calculate the difference in milliseconds
    const timeDifferenceMs = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to hours
    const hoursUsed = timeDifferenceMs / (1000 * 60 * 60); // 1000 milliseconds * 60 seconds * 60 minutes

    // Round to the nearest integer
    return `${Math.round(hoursUsed)}`;
  };

  const formatDateTimeToHHMMPM = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const handleViewClick = (row: Reservation) => {
    // // const formattedReservation: ReservationDataForModal = formatReservation(row);
    console.log("ROW IS BELOW:");
    console.log(row);

    // Fetch values first
    fetch("http://localhost:3001/get-all-reservations-with-dummy-data", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservation_id: row.reservation_id }), // Uncomment this line if you need to send data in the request body
    })
      .then((response) => response.json())
      .then((xx) => {
        console.log("FETCH IS BELOW:");
        console.log(xx);

        // // Fetch name values
        // fetch("http://localhost:3001/get-user-information", {
        //   method: "POST", // or 'PUT'
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ email: user_id }), // Uncomment this line if you need to send data in the request body
        // })
        //   .then((response) => response.json())

        // Fetch name values
        fetch("http://localhost:3001/get-user-information", {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: row.user_id }), // Uncomment this line if you need to send data in the request body
        })
          .then((response) => response.json())
          .then((nameData) => {
            console.log("Got name info below:");
            console.log(nameData);

            // Fetch other values
            fetch("http://localhost:3001/get-reservation", {
              method: "POST", // or 'PUT'
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ reservation_id: row.reservation_id }), // Uncomment this line if you need to send data in the request body
            })
              .then((response) => response.json())
              .then((otherReservationInfo) => {
                console.log("Got reservation info below:");
                console.log(otherReservationInfo);

                // compose reservation data to send
                const reservationDataForModal: ReservationDataForModal = {
                  reservation_id: row.reservation_id,
                  status: row.status_code,

                  // first partition in left
                  reservation_date: formatDateTime(row.date_created),
                  room_name: row.room_name,
                  event_name: row.activity_name,
                  event_description: otherReservationInfo.reservations.activity_desc,
                  user_name: nameData.name,
                  user_id: row.user_id,

                  // for the module in the date part
                  reserve_day_day_string: extractReserveDayDayString(
                    row.start_datetime
                  ),
                  reserve_day_number: extractReserveDayNumber(
                    row.start_datetime
                  ),
                  reserve_month: extractReserveMonth(row.start_datetime),
                  reserve_year: extractReserveYear(row.start_datetime),
                  reserve_timeslot: `${formatDateTimeToHHMMPM(
                    row.start_datetime
                  )} - ${formatDateTimeToHHMMPM(row.end_datetime)}`,

                  // transaction details
                  duration: calculateHoursUsed(
                    row.start_datetime,
                    row.end_datetime
                  ),
                  hourly_fee: otherReservationInfo.reservations.fee,
                  overall_fee: otherReservationInfo.reservations.total_amount_due,
                  // overall_fee: `${(parseFloat(calculateHoursUsed(row.start_datetime, row.end_datetime)) * parseFloat(otherReservationInfo.reservations.fee)).toFixed(2)}`,

                  // dates
                  verified_date: formatDateTime(
                    `${otherReservationInfo.reservations.booked_date}`
                  ),
                  payment_date: formatDateTime(
                    `${otherReservationInfo.reservations.paid_date}`
                  ),
                  verification_date: formatDateTime(
                    `${otherReservationInfo.reservations.disapproved_date}`
                  ),
                  disapproved_date: formatDateTime(
                    `${otherReservationInfo.reservations.disapproved_date}`
                  ),
                  approved_date: formatDateTime(
                    `${otherReservationInfo.reservations.booked_date}`
                  ),
                  cancellation_date: formatDateTime(
                    `${otherReservationInfo.reservations.cancelled_date}`
                  ),

                  // note
                  note_from_admin:
                    otherReservationInfo.reservations.comment_text == ""
                      ? "(no note provided by staff)"
                      : `"${otherReservationInfo.reservations.comment_text}"`
                  ,

                  utilities: otherReservationInfo.utilities.join(", ")
                };

                handleOpen(reservationDataForModal);
              });
          });
    });
  };

  const handlePageChange = (
    event: any,
    value: React.SetStateAction<number>
  ) => {
    setCurrentPage(value);
  };

  const handleLatestClick = () => {
    const sortedData = [...dataTable].sort(
      (a, b) =>
        new Date(b.start_datetime).getTime() -
        new Date(a.start_datetime).getTime()
    );
    setDataTable(sortedData);
  };

  const handleOldestClick = () => {
    const sortedData = [...dataTable].sort(
      (a, b) =>
        new Date(a.start_datetime).getTime() -
        new Date(b.start_datetime).getTime()
    );
    setDataTable(sortedData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataTable.slice(indexOfFirstItem, indexOfLastItem);

  const dummyData = [
    { eventName: "Event 1", room: "Room 1", date: "2022-01-01", time: "10:00" },
    { eventName: "Event 2", room: "Room 2", date: "2022-01-02", time: "11:00" },
    // Add more dummy data as needed
  ];

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
            label="Search by event name"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="contained" onClick={handleLatestClick}>
            Latest
          </Button>
          <Button variant="contained" onClick={handleOldestClick}>
            Oldest
          </Button>
          <FormControl fullWidth>
            <InputLabel>Reservation View</InputLabel>
            <Select
              value={reservationView}
              label="Reservation View"
              onChange={handleViewChange}
            >
              <MenuItem value="all">All Reservations</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="For Payment">For Payment</MenuItem>
              <MenuItem value="Booked">Booked</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Items per page</InputLabel>
            <Select
              value={itemsPerPage}
              label="Items per page"
              onChange={handleItemsPerPageChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">RESERVATION ID</TableCell>
                <TableCell align="center">RESERVATION MADE BY</TableCell>
                <TableCell align="center">DATE</TableCell>
                <TableCell align="center">TIME</TableCell>
                <TableCell align="center">ROOM</TableCell>
                <TableCell align="center">EVENT NAME</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="center">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                  <TableRow key={index}>
                    {/* <TableCell>{row.start_datetime}</TableCell> */}
                    <TableCell
                      align="center"
                      style={{ wordWrap: "break-word", maxWidth: "150px" }}
                    >
                      {row.reservation_id}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ wordWrap: "break-word", maxWidth: "150px" }}
                    >
                      {row.user_id}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ wordWrap: "break-word", maxWidth: "150px" }}
                    >
                      {format(new Date(row.start_datetime), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ wordWrap: "break-word", maxWidth: "150px" }}
                    >
                      {format(new Date(row.start_datetime), "hh:mm a")} -{" "}
                      {format(new Date(row.end_datetime), "hh:mm a")}
                    </TableCell>{" "}
                    <RoomNameCell roomId={parseInt(row.room_id)} />
                    <TableCell
                      align="center"
                      style={{ wordWrap: "break-word", maxWidth: "150px" }}
                    >
                      {row.activity_name}
                    </TableCell>
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
                    <TableCell
                      align="center"
                      style={{ wordWrap: "break-word", maxWidth: "150px" }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleViewClick(row)}
                        style={{
                          backgroundColor: "#FFB533",
                          color: "#183048",
                          borderRadius: 5,
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No event found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Select reservation based on status */}
          {selectedReservation &&
            (() => {
              // return <ReservationDialogForVerification open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>
              // return <ReservationDialogForPaymentAdmin open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>
              // return <ReservationDialogCancelled open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>
              // return <ReservationDialogDisapproved open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>
              // return <ReservationDialogBooked open={open} onClose={() => setSelectedReservation(null)} reservation={selectedReservation}/>
              // })()
              switch (statusMapping[selectedReservation.status]) {
                case "Pending":
                  return (
                    <ReservationDialogForVerificationAdmin
                      open={open}
                      onClose={() => setSelectedReservation(null)}
                      reservation={selectedReservation}
                    />
                  );
                case "For Payment":
                  return (
                    <ReservationDialogForPaymentAdmin
                      open={open}
                      onClose={() => setSelectedReservation(null)}
                      reservation={selectedReservation}
                    />
                  );
                case "Cancelled":
                  return (
                    <ReservationDialogCancelled
                      open={open}
                      onClose={() => setSelectedReservation(null)}
                      reservation={selectedReservation}
                    />
                  );
                case "Rejected":
                  return (
                    <ReservationDialogDisapproved
                      open={open}
                      onClose={() => setSelectedReservation(null)}
                      reservation={selectedReservation}
                    />
                  );
                default:
                  return (
                    <ReservationDialogBooked
                      open={open}
                      onClose={() => setSelectedReservation(null)}
                      reservation={selectedReservation}
                    />
                  );
              }
            })()}
        </TableContainer>
        <Box
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <Pagination
            count={Math.ceil(dataTable.length / itemsPerPage)}
            variant="outlined"
            shape="rounded"
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default ReservationsPage;
