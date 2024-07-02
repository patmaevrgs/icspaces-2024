import {
  Avatar,
  Container,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { CSSProperties, useEffect } from "react";
import backgroundImage from "../assets/Welcome_BG.png";
import logoImage from "../assets/ICS_Logo.png";
import SignInBox from "../components/SignInBox";
import { useLocation } from "react-router-dom";
import React from "react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
const LoginPage = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const isTabletScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("sm", "md")
  );

  // Styles for the container holding the login page content
  const containerStyle: CSSProperties = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
  };

  // Adjusted text styles that include responsive settings for font sizes
  const textStyle: CSSProperties = {
    fontWeight: "bold",
    color: "#FFB532",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    fontSize: isSmallScreen ? "calc(1vw + 15px)" : "calc(1vw + 20px)", // Responsive font size
  };

  // Extra padding for tablet screen to avoid hiding behind the navbar
  const tabletPaddingTop = isTabletScreen ? "20px" : "0px";

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get("error");

  const [open, setOpen] = useState(!!errorMessage);

  const handleClose = (reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setOpen(!!errorMessage);
  }, [errorMessage]);

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        onClose={(event, reason) => handleClose(reason)}
        message={errorMessage}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        justifyContent="space-evenly"
        alignItems="center"
        spacing={2}
        padding={2}
        style={containerStyle}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="flex-start"
          padding={2}
          style={{ paddingTop: tabletPaddingTop }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Avatar
              src={logoImage}
              sx={{
                width: isSmallScreen ? 80 : 100,
                height: isSmallScreen ? 80 : 100,
              }}
            />
            <Typography variant="h1" sx={{ textAlign: "start", ...textStyle }}>
              Institute of <br /> Computer Science
            </Typography>
          </Stack>

          <Container sx={{ paddingTop: "20px" }}>
            <Typography
              variant="h1"
              sx={{
                textAlign: "start",
                ...textStyle,
                fontSize: isSmallScreen
                  ? "calc(2vw + 40px)"
                  : "calc(1vw + 120px)",
              }}
            >
              ICSpaces
            </Typography>
            <Typography
              variant="h1"
              sx={{
                textAlign: "start",
                ...textStyle,
                fontSize: isSmallScreen
                  ? "calc(1vw + 20px)"
                  : "calc(1vw + 20px)",
                color: "#fff",
              }}
            >
              An ICS Room Reservation System
            </Typography>
          </Container>
        </Stack>
        <SignInBox />
      </Stack>
    </div>
  );
};

export default LoginPage;
