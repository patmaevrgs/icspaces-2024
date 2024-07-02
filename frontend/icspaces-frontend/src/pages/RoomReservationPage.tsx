import { Typography,Box, Container , Grid} from "@mui/material";
import RoomReservationForm from "../components/RoomReservationForm";
import HomeBG from "../assets/room_images/HomeBG.png";

const RoomReservationPage = () => {
  return (


    <Box style={{ minHeight: "calc(100vh - 5px)", maxHeight: "calc(100vh - 5px)",  overflow: "auto" }}  padding={5}>
      <RoomReservationForm/>
    </Box>

    
  );
};

export default RoomReservationPage;
