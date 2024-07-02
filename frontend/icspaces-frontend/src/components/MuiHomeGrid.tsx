import { Box, Stack, Grid, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link } from "react-router-dom";

const MuiHomeGrid = () => {
  const StyledBox = (
    props: any //Bottom three cells
  ) => (
    <Box
      sx={{
        backgroundColor: "#DDDDDD90",
        color: "#183048",
        borderRadius: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 70,
        fontSize: {
          xs: 14,
          sm: 18,
          lg: 18,
        },
        padding: 1,
        "&:hover": {
          color: "#FFFFFF",
          backgroundColor: "#183048",
        },
        "&:hover .AnyIcon": {
          //change icon color
          color: "#FFFFFF",
        },
        "&:hover .TextIcon": {
          //change text color
          color: "#FFFFFF",
        },
      }}
    >
      {" "}
      {props.children}
    </Box>
  );

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={1}>
        {/*Grid is responsive UI */}
        <Grid item xs={12}>
          {/*Every row in Grid container is equal to 12, so this item takes up the entire row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "left",
              textAlign: "left",
              backgroundColor: "#183048",
              color: "#FFFFFF",
              borderRadius: "15px",
              padding: "2.5%",
              paddingLeft: "5%",
            }}
          >
            <Stack direction="column" spacing={1}>
              <Typography
                variant="h3"
                color="#FFB532"
                sx={{ fontSize: { xs: 30, sm: 40 } }}
              >
                Hello, Frontend!
              </Typography>
              <p>Today is Tuesday, March 04, 2024. </p>
              <p>You have 3 upcoming events. </p>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} rowSpacing={5}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "left",
              padding: 0,
              marginTop: 2,
            }}
          >
            <Typography variant="h5" color="#183048">
              Quick Links
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <StyledBox>
            <Link
              to="/rooms"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Stack direction="column" alignItems="center">
                <SearchIcon
                  sx={{ fontSize: 40, color: "#183048" }}
                  className="AnyIcon"
                />

                <div>View ICS Rooms</div>
              </Stack>
            </Link>
          </StyledBox>
        </Grid>
        <Grid item xs={3}>
          <Link
            to="/status"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <StyledBox>
              <Stack direction="column" alignItems="center">
                <BookmarksOutlinedIcon
                  sx={{ fontSize: 40, color: "#183048" }}
                  className="AnyIcon"
                />

                <div>Reservation Status</div>
              </Stack>
            </StyledBox>
          </Link>
        </Grid>
        <Grid item xs={3}>
          <Link
            to="/reserve"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <StyledBox>
              <Stack direction="column" alignItems="center">
                <CalendarTodayIcon
                  sx={{ fontSize: 40, color: "#183048" }}
                  className="AnyIcon"
                />
                <div>Make Reservation</div>
              </Stack>
            </StyledBox>
          </Link>
        </Grid>
        <Grid item xs={3}>
          <Link
            to="/FAQ"
            className="TextIcon"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <StyledBox>
              <Stack direction="column" alignItems="center">
                <HelpOutlineIcon
                  sx={{ fontSize: 40, color: "#183048" }}
                  className="AnyIcon"
                />
                <div>FAQs</div>
              </Stack>
            </StyledBox>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default MuiHomeGrid;
