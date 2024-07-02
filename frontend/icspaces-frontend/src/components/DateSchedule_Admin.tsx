import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const DateSchedule_Admin: React.FC = () => {
  return (
    <Box display="flex" justifyContent="center" gap={2} alignItems="center">
      <Button variant="outlined" startIcon={<ArrowBackIosIcon />}>
        Previous Week
      </Button>
      <Paper elevation={3} sx={{ padding: 1 }}>
        <Typography variant="h6">DATE</Typography>
      </Paper>
      <Button variant="outlined" endIcon={<ArrowForwardIosIcon />}>
        Next Week
      </Button>
    </Box>
  );
};

export default DateSchedule_Admin;
