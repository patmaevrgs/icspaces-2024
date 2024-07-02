import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem } from "@mui/material";
import BackButton from "../../components/BackButton";
import SearchIcon from "@mui/icons-material/Search";

interface Log {
  notification_type: number;
  notification_action: string;
  notification_body: string;
  notification_date: string;
}

const UserLogPage_Admin = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterByType, setFilterByType] = useState<number | null>(-1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-system-logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data: Log[] = await response.json(); 

        const formattedLogs = data.map((log: Log) => ({
          ...log,
          notification_date: new Date(log.notification_date).toLocaleDateString()
        }));
        setLogs(formattedLogs);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, []);

  console.log("Logs:", logs);

  const filterLogs = (log: Log) => {
    const { notification_type, notification_action, notification_body, notification_date } = log;
    const searchTerm = searchQuery.toLowerCase();

    const type = notification_type != null ? notification_type.toString().toLowerCase() : "";

    // Adjust filter logic to consider both 0 and 2 for "Reservation"
    const typeMatches = filterByType === null 
      || filterByType === -1 
      || (filterByType === 0 && (notification_type === 0 || notification_type === 2))
      || filterByType === notification_type;
    
    const searchMatches =
      type.includes(searchTerm) ||
      notification_action.toLowerCase().includes(searchTerm) ||
      notification_body.toLowerCase().includes(searchTerm) ||
      new Date(notification_date).toLocaleDateString().includes(searchTerm);

    return typeMatches && searchMatches;
  };

  const getTypeDescription = (type: number) => {
    switch (type) {
      case 0:
        return "Reservation";
      case 1:
        return "User";
      case 2:
        return "Reservation";
      case 3:
        return "Room";
      default:
        return "Unknown";
    }
  };

  return (
    <Box style={{ overflow: "auto", height: "calc(100vh - 2vh)" }}>
      <Grid container justifyContent="center" spacing={2} mt={7} mb={5}>
        <Grid item md={11} mb={3} mt={2}>
          <Box display="flex" alignItems="flex-start">
            <BackButton />
            <Typography
              variant="h4"
              ml={2}
              color="primary"
              style={{ fontWeight: "bold" }}
            >
              User Logs
            </Typography>
          </Box>
        </Grid>
        <Grid item md={6} mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ endAdornment: <SearchIcon /> }}  
          />
        </Grid>
        <Grid item md={5} mb={3}>
        <Select
          fullWidth
          variant="outlined"
          value={filterByType !== null ? filterByType.toString() : ""}
          onChange={(e) => setFilterByType(Number(e.target.value))}
        >
          <MenuItem value="-1">All Types</MenuItem>
          <MenuItem value="0">Reservation</MenuItem>
          <MenuItem value="1">User</MenuItem>
          <MenuItem value="3">Room</MenuItem>
        </Select>
        </Grid>
        <div style={{ height: "calc(100vh - 350px)", overflowY: "auto", paddingTop: "20px", width: "100%" }}> 
          <TableContainer component={Paper} style={{ width: "85%", margin: "auto", paddingLeft: "30px", paddingRight: "30px"}}>
            <Table style={{ minWidth: 500 }}> 
              <TableHead>
                <TableRow>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center" style={{ paddingLeft: "40px" }}>Action</TableCell>
                  <TableCell align="center" style={{ paddingLeft: "40px" }}>Details</TableCell>
                  <TableCell align="center" style={{ paddingLeft: "40px" }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.filter(filterLogs).map((log, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{getTypeDescription(log.notification_type)}</TableCell>
                    <TableCell align="center" style={{ paddingLeft: "40px" }}>{log.notification_action}</TableCell>
                    <TableCell align="center" style={{ paddingLeft: "40px" }}>{log.notification_body}</TableCell>
                    <TableCell align="center" style={{ paddingLeft: "40px" }}>{log.notification_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
    </Box>
  );
};

export default UserLogPage_Admin;
