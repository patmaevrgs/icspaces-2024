import React, { useState, MouseEvent } from "react";
import {
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Stack,
  Button,
  Popover,
  useMediaQuery,
  useTheme,
  TextField,
  Box,
  Divider,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRoomFilter } from './RoomFilterContext'; // Import the hook from context

const FilterButton = ({
  label,
  handleClick,
}: {
  label: string;
  handleClick: (event: MouseEvent<HTMLElement>) => void;
}) => (
  <Button variant="text" color="primary" onClick={handleClick}>
    {label}
    {<ArrowDropDownIcon />}
  </Button>
);

const FilterPopover = ({
  id,
  open,
  anchorEl,
  handleClose,
  children,
}: {
  id: string;
  open: boolean;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  children: React.ReactNode;
}) => (
  <Popover
    id={id}
    open={open}
    anchorEl={anchorEl}
    onClose={handleClose}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
  >
    <Paper sx={{ padding: "1rem", maxWidth: "100vw" }}>{children}</Paper>
  </Popover>
);

const Filters = ({ items, onChange }: { items: string[]; onChange: (item: string) => void }) => (
  <Stack>
    {items.map((item, index) => (
      <FormControlLabel
        key={index}
        control={<Checkbox color="secondary" onChange={() => onChange(item)} />}
        label={item}
      />
    ))}
  </Stack>
);

const RoomFilters = () => {
  const { setSelectedRoomTypes, setSelectedCapacities, setSelectedUtility, setSelectedFeeRange } = useRoomFilter();

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [utilitySearch, setUtilitySearch] = useState("");

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleRoomTypeChange = (type: string) => {
    setSelectedRoomTypes((prev: string[]) =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleCapacityChange = (capacity: string) => {
    setSelectedCapacities((prev: string[]) => {
      const range = capacity.split('-').map(Number); // Convert "1-30" to [1, 30]
      return prev.some(c => {
        const currentRange = c.split('-').map(Number);
        return range[0] === currentRange[0] && range[1] === currentRange[1];
      })
        ? prev.filter(c => {
            const currentRange = c.split('-').map(Number);
            return range[0] !== currentRange[0] || range[1] !== currentRange[1];
          })
        : [...prev, capacity];
    });
  };

  const handleUtilitySearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUtilitySearch(event.target.value);
    setSelectedUtility(event.target.value);  // Assuming you will add this in the context
  };


  const handleFeeRangeChange = (range: string) => {
    setSelectedFeeRange((prev: string[]) => {  
      return prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range];
    });
  };
  

  return smallScreen ? (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        justifyItems: "center",
        top: "64px",
        left: 0,
        right: 0,
        p: 1,
        mt: { xs: -1, sm: -0.5 },
        justifyContent: "center",
        bgcolor: "background.paper",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "30px",
          mt: 1,
          mx: 1,
        }}
      >
      <TextField
        label="Search for a utility:"
        variant="outlined"
        size="small"
        value={utilitySearch}
        onChange={handleUtilitySearchChange} // Bind the handler
      />
        <FilterButton label="Filter" handleClick={handleClick} />
        <FilterPopover
          id="filter-popover"
          open={open}
          anchorEl={anchorEl}
          handleClose={handleClose}
        >
        <Box mt={2}>
        <Typography variant="h6" align="left">Room Type:</Typography>
        </Box>
          <Filters items={["Lecture Hall", "Conference Room", "Computer Lab"]} onChange={handleRoomTypeChange} />
          <Divider />
          <Typography variant="h6">Capacity</Typography>
          <Filters items={["1-30", "31-50", "51-100"]} onChange={handleCapacityChange} />
          <Divider />
          <Typography variant="h6">Cost:</Typography>
          <Filters items={["Below 1000", "1001 - 3000", "3000 Above"]} onChange={handleFeeRangeChange} />
        </FilterPopover>
      </Box>
    </Box>
  ) : (
    <Paper
      sx={{
        padding: "1rem",
        position: "fixed",
        width: { sm: "none", md: "10rem", lg: "15rem" },
      }}
    >
      <TextField
        label="Search for a utility:"
        variant="outlined"
        value={utilitySearch}
        onChange={handleUtilitySearchChange} // Bind the handler
      />
        <Box mt={2}>
        <Typography variant="h6" align="left">Room Type:</Typography>
        </Box>
      <Filters items={["Lecture Hall", "Conference Room", "Computer Lab"]} onChange={handleRoomTypeChange} />
      <Divider />
      <Stack marginTop="1rem" textAlign="start" color="primary">
        <Typography variant="h6">Capacity</Typography>
        <Filters items={["1-30", "31-50", "51-100"]} onChange={handleCapacityChange} />
        <Divider />
        <Box mt={2}>
        <Typography variant="h6">Cost:</Typography>
        </Box>
        <Filters items={["Below 1000", "1001 - 3000", "3000 Above"]} onChange={handleFeeRangeChange} />
      </Stack>
    </Paper>
  );
};

export default RoomFilters;
