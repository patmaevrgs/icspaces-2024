import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";

const styles = {
  container: {
    paddingTop: '5px', // Adjust spacing as needed
  },
};

interface CalendarProps {
  onDateSelect: (date: dayjs.Dayjs) => void;
}

const DateCalendarValue: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const today = dayjs();
  const [value, setValue] = React.useState(today); // Set initial value to today

  return (
    <Grid container direction="column" alignItems="center" spacing={1} style={styles.container}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid item>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#FFC000",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            BOOK NOW !!
          </Typography>
        </Grid>
        <Grid item>
          <DemoContainer components={['DateCalendar', 'DateCalendar']}>
            <DemoItem>
              <DateCalendar 
                value={value} 
                onChange={(newValue) => {
                  setValue(newValue); // Update value state
                  onDateSelect(newValue); // Pass selected date to parent component
                }} 
                minDate={today} // Set minDate to disable past dates
              />
            </DemoItem>
          </DemoContainer>
        </Grid>
      </LocalizationProvider>
    </Grid>
  );
};

export default DateCalendarValue;
