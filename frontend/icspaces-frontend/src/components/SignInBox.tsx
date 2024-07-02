import {
  Avatar,
  Button,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import googleIcon from "../assets/GoogleIcon.png";
import googleLogin from "../utils/googleLogin";
import { Link } from "react-router-dom";
const SignInBox = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Adjusted styles for smaller screens
  const boxStyle = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    height: "auto", // More flexible content adjustment
    width: isSmallScreen ? "80%" : "351px", // Slightly smaller width on small screens
    padding: isSmallScreen ? "20px" : "25px", // Less padding on small screens
    borderRadius: "16px",
    margin: isSmallScreen ? "auto" : "0", // Center the box on smaller screens
  };

  const buttonStyle = {
    backgroundColor: "#FAFAFA",
    color: "black",
    borderRadius: "12px",
    borderColor: "#EBECE6",
    borderStyle: "solid",
    height: "45px", // Slightly smaller buttons
    textTransform: "none", // To make the text not all caps
    width: "100%", // Full width for better button visibility
    fontSize: isSmallScreen ? "0.875rem" : "1rem", // Smaller font on buttons for small screens
  };

  const textStyle = {
    textAlign: "start",
    fontWeight: "bold",
    fontSize: isSmallScreen ? "20px" : "30px", // Smaller text size on smaller screens
    marginBottom: "15px",
  };

  return (
    <Box sx={boxStyle}>
      <Stack direction="column" justifyContent="space-around">
        <Typography variant="h4" sx={textStyle}>
          Login
        </Typography>
        <Stack
          direction="column"
          justifyContent="space-around"
          spacing={isSmallScreen ? 1 : 2}
        >
          <Button
            variant="outlined"
            sx={buttonStyle}
            startIcon={
              <Avatar src={googleIcon} sx={{ width: 20, height: 20 }} />
            }
            onClick={() => googleLogin()}
          >
            Sign in using your UP account
          </Button>
          {/* <Button variant="outlined" onClick={() => googleLogin()} sx={buttonStyle} startIcon={
              <Avatar src={googleIcon} sx={{ width: 20, height: 20 }} />
            }>
            Log in as Administrator
          </Button> */}
        </Stack>
        <Divider sx={{ marginY: 2 }}>or</Divider>
        <Link to="/viewrooms_guest">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFB532",
              color: "black",
              borderRadius: "12px",
              textTransform: "none",
              width: "100%",
              height: "50px", // Slightly smaller height
              fontSize: "0.875rem", // Smaller font size
              "&:hover": {
                backgroundColor: "#FFC532",
              },
            }}
          >
            <span style={{ padding: "20px 20px" }}>
              {" "}
              {/* Added padding around the text */}
              Are you a guest? <b>Reserve a room</b>
            </span>
          </Button>
        </Link>
        
      </Stack>
    </Box>
  );
};

export default SignInBox;
