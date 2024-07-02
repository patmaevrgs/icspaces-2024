import RoomFilters from "../components/RoomFilters";
import RoomList from "../components/RoomList";
import { Box, Stack } from "@mui/material";

const ViewRoomsPage = () => {
  return (
    <Box style={{ maxHeight: "calc(100vh - 64px)", overflow: "auto" }}>
      <Stack direction="row" spacing={1} justifyContent="space-evenly" sx={{ mt: { xs: 10, sm: 10, md: 5 }, padding: 5 }}>
        <Box sx={{ flex: "1 1 300px" }}>
          <RoomFilters />
        </Box>
        <Box sx={{ flex: "3 1 600px" }}> 
          <RoomList />
        </Box>
      </Stack>
    </Box>
  );
};

export default ViewRoomsPage;
