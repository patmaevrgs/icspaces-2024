import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MuiHomeGrid: React.FC = () => {
  const userTypeMapping: { [key: number]: string } = {
    0: "Student",
    1: "Faculty",
    2: "Officer In Charge",
    3: "Director",
  };

  interface User {
    email: string;
    displayname: string;
    profilepic: string;
    usertype: string; // Changed this to string
  }

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3001/get-profile", {
          withCredentials: true,
        });

        if (response.data.success) {
          const user = response.data.data;
          // Map the usertype number to its corresponding string
          user.usertype = userTypeMapping[user.usertype];
          setUser(user);
          setEmail(user.email);
        } else {
          throw new Error(response.data.errmsg);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/homepage");
      }
    };

    fetchUser();
  }, [navigate]);

  console.log("THIS EMAIL", email);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("EMAIL", email);

        const response = await fetch(
          "http://localhost:3001/get-notifications-for-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: email }), // replace target_user_id variable with the variable
          } // na nag hohold ng id ng user
        );

        if (response.ok) {
          const data = await response.json();
          console.log("NOTIF", data);
          setNotifications(data);
        } else {
          console.log("NOT FETCHING");
        }

        // variable "data" now contains yung rows ng notifs for that user
        // return data;
        // setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };

    fetchNotifications();
  }, [email]);

  const [currentDate, setCurrentDate] = useState(new Date());

  //   NOTIF
  // (2) [{…}, {…}]
  // 0
  // :
  // {notification_type: 0, notification_action: 'Reservation Added', notification_body: "Added Jaymart Latigay's reservation for activity fvjfvvv (Pending)", notification_date: '2024-06-01T08:11:58.000Z', actor_id: 'jglatigay@up.edu.ph', …}
  // 1
  // :
  // {notification_type: 0, notification_action: 'Reservation Added', notification_body: "Added Jaymart Latigay's reservation for activity dfjdfsd (Pending)", notification_date: '2024-06-01T08:01:48.000Z', actor_id: 'jglatigay@up.edu.ph', …}
  // length
  // :
  // 2
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentDate(new Date());
  //   }, 1000); // Update every second
  //   return () => clearInterval(interval);
  // }, []);

  console.log("NOTIFICATIONS", notifications);
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const NotifBoxTwo = (props: any) => (
    <Box
      sx={{
        background: "#FFFFFF", // Set background to white
        color: "#183048",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Calibri, sans-serif",
        height: 110,
        overflow: "auto",
        flexDirection: "column",
        fontSize: {
          xs: 14,
          sm: 18,
          lg: 18,
        },
        padding: 1,
        boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
        marginTop: 1, // Add marginTop to create space between text and StyledBox
      }}
    >
      <Box
        sx={{
          width: "100%", // Make the inner box take up the full width of the outer box
          overflowY: "auto", // Add a vertical scrollbar to the inner box
        }}
      >
        {props.notifications && props.notifications.length > 0 ? (
          props.notifications.map((notif: any, index: number) => {
            const dateTime = new Date(notif.notification_date).toLocaleString();
            const isLatest = index === 0;
            return (
              <Accordion key={index} style={{ width: "100%" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography
                      color={isLatest ? "secondary" : "primary"}
                      fontWeight={isLatest ? "medium" : "regular"}
                    >
                      {notif.notification_action}
                    </Typography>
                    <Typography color="light grey">{dateTime}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails style={{ overflow: "auto" }}>
                  <Typography>{notif.notification_body}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Typography>No notifications, right now.</Typography>
        )}
      </Box>
    </Box>
  );

  const StyledBox = (props: any) => (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #FFFFFF, #c5d2d9)",
        color: "#183048",
        borderRadius: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Calibri, sans-serif",
        height: 70,
        fontSize: {
          xs: 14,
          sm: 18,
          lg: 18,
        },
        padding: 1,
        boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
        "&:hover": {
          color: "#FFFFFF",
          background: "#183048",
        },
        "&:hover .AnyIcon": {
          color: "#FFFFFF",
        },
        "&:hover .TextIcon": {
          color: "#FFFFFF",
        },
      }}
    >
      {props.children}
    </Box>
  );

  const NotifBox = (props: any) => (
    <Box
      sx={{
        backgroundColor: "#183048",
        color: "#FFFFFF",
        borderRadius: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: 163,
        fontSize: {
          xs: 14,
          sm: 18,
          lg: 24,
        },
        padding: 1,
        boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      {props.children}
    </Box>
  );

  return (
    <Grid container rowSpacing={1} columnSpacing={1}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            textAlign: "left",
            backgroundColor: "#183048",
            color: "#FFFFFF",
            borderRadius: "15px",
            padding: "3.5%",
            paddingLeft: "5%",
            fontFamily: "Calibri, sans-serif",
            boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Stack direction="column" spacing={1}>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: 30, sm: 40 }, color: "#FFB532" }}
            >
              Hello, {user?.displayname}!
            </Typography>
            <Stack>
              <Typography variant="body1">Today is {formattedDate}</Typography>
              {/* <Typography variant="body1">You have 3 upcoming events.</Typography> */}
            </Stack>
          </Stack>
        </Box>
      </Grid>

      {/* Quick Links */}
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            padding: 0,
            marginTop: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: "#183048" }}>
            Quick Links
          </Typography>
        </Box>
      </Grid>
      {/* End of Quick Links */}

      <Grid container item xs={12} spacing={1}>
        <Grid item xs={7}>
          <NotifBox>
            {/* <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Notification 
            </Typography> */}
            <Grid container item xs={12} direction={"column"}>
              <Grid item xs={5}>
                <Typography>Notification Box</Typography>
              </Grid>
              <Grid item xs={12}>
                <NotifBoxTwo notifications={notifications} />
                {/* <div>{notification.notification_action}</div>
                      <div>{notification.notification_body}</div> */}
                {/* <NotifBoxTwo notifications={notifications} /> */}

                {/* <div>{notifications}</div> */}
                {/* </NotifBoxTwo> */}
              </Grid>
            </Grid>
          </NotifBox>
        </Grid>

        <Grid item xs={5}>
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item xs={6}>
              <Link
                to="/accountpage"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <StyledBox>
                  <Stack direction="column" alignItems="center">
                    <SearchIcon
                      sx={{ fontSize: 40, color: "#183048" }}
                      className="AnyIcon"
                    />
                    <div>Account</div>
                  </Stack>
                </StyledBox>
              </Link>
            </Grid>
            <Grid item xs={6}>
              <Link
                to="/viewroomspage"
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
            <Grid item xs={6}>
              <Link
                to="/reservationspage"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <StyledBox>
                  <Stack direction="column" alignItems="center">
                    <BookmarksOutlinedIcon
                      sx={{ fontSize: 40, color: "#183048" }}
                      className="AnyIcon"
                    />
                    <div>Reservations</div>
                  </Stack>
                </StyledBox>
              </Link>
            </Grid>
            <Grid item xs={6}>
              <Link
                to="/faqspage"
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MuiHomeGrid;
