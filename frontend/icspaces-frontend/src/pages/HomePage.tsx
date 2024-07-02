import { Box, Container } from "@mui/material";
import MuiHomeGridFinal from "../components/MuiHomeGridFinal";
import HomeBG from "../assets/room_images/HomeBG.png";
import { useEffect, useState } from "react";
import FirstLogInPopUp from "../components/FirstLoginPopUp";
const HomePage = () => {
  console.log("HomePage rendered"); // Add this line

  const [isFirstLogin, setFirstLogin] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/get-profile", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);

        if (data.success) {
          setFirstLogin(data.data.isFirstLogin);
          console.log("isFirstLogin", data.data.isFirstLogin);
        }
      });
  }, [isFirstLogin]); // Empty dependency array ensures thi
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",

        margin: 0,
        // marginTop:'-2vh',//di ko gets bakit may white gap between navbar and box,
        backgroundImage: `url(${HomeBG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {isFirstLogin ? <FirstLogInPopUp /> : null}
      {/* <Box sx={{ marginTop: 10 }}> Previous
        <MuiBox />
      </Box> */}

      <Container>
        <MuiHomeGridFinal />
      </Container>
    </Box>
  );
};

export default HomePage;
