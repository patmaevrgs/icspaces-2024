import { useState } from "react";
import {
  TextField,
  ButtonGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Theme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material/Select";
import useMediaQuery from "@mui/material/useMediaQuery";

const ReservationsFilters = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("Latest");
  const [filter, setFilter] = useState("All Reservations");
  const [itemsCount, setItemsCount] = useState(5);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSortOrderChange = (order: string) => {
    setSortOrder(order);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value as string);
  };

  const handleItemsCountChange = (event: SelectChangeEvent<number>) => {
    setItemsCount(event.target.value as number);
  };

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  return (
    <Grid
      container
      mb={2}
      direction={isSmallScreen ? "column" : "row"}
      spacing={2}
    >
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          label="Search event name"
          value={search}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2} mt={2}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button
            onClick={() => handleSortOrderChange("Latest")}
            variant={sortOrder === "Latest" ? "contained" : "outlined"}
          >
            Latest
          </Button>
          <Button
            onClick={() => handleSortOrderChange("Oldest")}
            variant={sortOrder === "Oldest" ? "contained" : "outlined"}
          >
            Oldest
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl variant="outlined">
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={handleFilterChange}
            label="Filter"
          >
            <MenuItem value="All Reservations">All Reservations</MenuItem>
            <MenuItem value="For Verification">For Verification</MenuItem>
            <MenuItem value="For Payment">For Payment</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Disapproved">Disapproved</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={1}>
        <FormControl variant="outlined">
          <InputLabel id="items-count-label">Rows</InputLabel>
          <Select
            labelId="items-count-label"
            value={itemsCount}
            onChange={handleItemsCountChange}
            label="Items Count"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ReservationsFilters;
