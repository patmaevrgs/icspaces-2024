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

const AccountFilters = () => {
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
      direction={isSmallScreen ? "column" : "row"}
      spacing={2}
      width='100%'
    >
      <Grid item xs={12} sm={6} md={5}  style={{display:"flex",justifyContent:"flex-start"}}>
        <TextField
          label="Search account name"
          value={search}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{ endAdornment: <SearchIcon /> }}   
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={5} mt={2} >
        <ButtonGroup  size='medium'color="primary" aria-label="outlined primary button group" sx={{alignContent:'left'}} >
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
          <Button
          onClick={() => handleSortOrderChange("Reset")}
            variant={sortOrder === "Reset" ? "contained" : "outlined" }
          >
            Reset
          </Button>
        </ButtonGroup>

      </Grid>

      <Grid item xs={12} sm={6} md={2} container direction='column' style={{display:"flex",justifyContent:"flex-start"}}>
        <FormControl variant="outlined" >
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={handleFilterChange}
            label="Filter"
          >
            <MenuItem value="All Reservations">All</MenuItem>
            <MenuItem value="Cancelled">Students</MenuItem>
            <MenuItem value="For Verification">Faculty</MenuItem>
            <MenuItem value="For Verification1">OIC</MenuItem>
            <MenuItem value="For Verification2">Director</MenuItem>
          </Select>
        </FormControl>
      </Grid>

    </Grid>
  );
};

export default AccountFilters;
