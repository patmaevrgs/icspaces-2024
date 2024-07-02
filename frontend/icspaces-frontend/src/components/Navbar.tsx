import React, { useEffect, useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Drawer,
  Avatar,
} from "@mui/material";
import icspaces_logo from "../assets/ICSpaces_logo.png";
import { Link, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import AuthContext from "../utils/AuthContext";

interface ProfileData {
  firstName: string;
  profilepic: string;
  // Add other properties as needed
}

const NavBar = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNav(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorNav(null);
  };

  // Menu items
  // const menuItems = [
  //   { label: "Login", link: "/" },
  //   { label: "Home", link: "/homepage" },
  //   { label: "View Rooms", link: "/viewroomspage" },
  //   { label: "My Reservations", link: "/reservationspage" },
  //   { label: "Account", link: "/accountpage" },
  //   // Add more menu items as needed
  // ];
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // const [isAdmin, setIsAdmin] = useState(false);
  // const menuItems = isAdmin
  //   ? [
  //       { label: "Home", link: "/homepage_admin" },
  //       { label: "Reservations", link: "/reservationspage_admin" },
  //       { label: "Rooms", link: "/roomspage_admin" },
  //       { label: "Accounts", link: "/accountspage_admin" },
  //       { label: "Schedules", link: "/schedulepage" },
  //       {
  //         label: "Make Reservation",
  //         link: "/bookreservationpage_admin",
  //       },
  //       { label: "Add Room", link: "/addroom_admin" },
  //       { label: "Normal User", onClick: () => setIsAdmin(false) },
  //     ]
  //   : [
  //       { label: "Login", link: "/" },
  //       { label: "Home", link: "/homepage" },
  //       { label: "View Rooms", link: "/viewroomspage" },
  //       { label: "My Reservations", link: "/reservationspage" },
  //       { label: "Schedules", link: "/schedulepage" },
  //       { label: "Track Reservation", link: "/reservationtracker_guest" },
  //       { label: "View Rooms Guest", link: "/viewrooms_guest" },
  //       { label: "Book Room", link: "/roombookingform_guest" },

  //       { label: "FAQs", link: "/faqspage" },

  //       { label: "Admin", onClick: () => setIsAdmin(true) }, // non-admin menu items here

  //       // { label: "Account", link: "/accountpage" },
  //     ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setProfileData(data.data);
          setUserType(data.data.usertype);
          // setIsLoggedIn(true); // Set isLoggedIn to true
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const response = await fetch("http://localhost:3001/is-logged-in", {
  //       credentials: "include",
  //     });
  //     const data = await response.json();
  //     setIsLoggedIn(data.isLoggedIn);
  //   };

  //   checkLoginStatus();
  // }, []);
  // console.log("PROFILE DATA", profileData);
  // console.log("USER TYPE:", userType);
  const buttons = isLoggedIn
    ? Number(userType) === 0
      ? [
          { label: "Home", link: "/homepage" },
          { label: "View Rooms", link: "/viewroomspage" },
          { label: "My Reservations", link: "/reservationspage" },
          { label: "FAQs", link: "/faqspage" },
        ]
      : Number(userType) === 1
      ? [
          { label: "Home", link: "/homepage" },
          { label: "View Rooms", link: "/viewroomspage" },
          { label: "My Reservations", link: "/reservationspage" },
          { label: "Schedules", link: "/schedulepage" },
          { label: "FAQs", link: "/faqspage" },
        ]
      : [
          { label: "Home", link: "/homepage_admin" },
          { label: "Reserve Room", link: "/bookreservationpage_admin" },
          { label: "Reservations", link: "/reservationspage_admin" },
          { label: "Rooms", link: "/roomspage_admin" },
          { label: "Add Room", link: "/addroom_admin" },
          { label: "Schedules", link: "/schedulepage" },
          { label: "Accounts", link: "/accountspage_admin" },
          { label: "User Logs", link: "/userlogspage_admin" },
          { label: "Revenue", link: "/revenuereport_admin" },
        ]
    : [
        { label: "View Rooms Guest", link: "/viewrooms_guest" },
        { label: "Book Room", link: "/roombookingform_guest" },
        { label: "Track Reservation", link: "/reservationtracker_guest" },
        { label: "FAQs", link: "/faqspage" },
      ];

  if (location.pathname === "/") {
    return null;
  }

  if (location.pathname === "/login-fail") {
    return null;
  }
  console.log("Navbar isLoggedIn:", isLoggedIn); // Print to console

  return (
    <Box sx={{ marginBottom: { xs: 3, sm: 8, md: 1 } }}>
      {" "}
      {/* Add bottom margin */}
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={icspaces_logo} alt="UPLB Logo" height="50" width="50" />
            <Typography variant="h6" component="div" color="secondary" ml={2}>
              ICSpaces
            </Typography>
          </Box>

          <Box sx={{ justifyContent: "center" }} />

          {/* Render menu items */}
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Stack
              direction="row"
              spacing={2}
              sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}
              justifyContent="center"
            >
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  component={button.link ? RouterLink : "button"}
                  to={button.link}
                  onClick={() => {
                    setSelectedItem(button.label); // Set the selected item
                  }}
                  color={
                    location.pathname === button.link ? "secondary" : "inherit"
                  } // Change color if current route
                  sx={{ "&:hover": { color: "#FFB532" } }}
                >
                  {button.label}
                </Button>
              ))}
            </Stack>
          )}
          {isLoggedIn ? (
            <Button
              color="inherit"
              component={Link}
              to="/accountpage"
              onClick={() => {
                /* Add the onClick handler for the "Account" button */
              }}
            >
              <IconButton color="secondary">
                <Avatar
                  alt={profileData ? profileData.firstName : ""}
                  src={profileData ? profileData.profilepic : ""}
                />
              </IconButton>
              <Typography
                variant="button"
                color={
                  location.pathname === "/accountpage" ? "secondary" : "inherit"
                }
                sx={{
                  "&:hover": {
                    color: "secondary.main",
                  },
                  "&:active": {
                    color: "secondary.main",
                  },
                }}
              >
                {profileData && profileData.firstName}
              </Typography>
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/"
              onClick={() => {
                /* Add the onClick handler for the "Guest" button */
              }}
            >
              <Typography
                variant="button"
                color="inherit"
                sx={{
                  "&:hover": {
                    color: "secondary.main",
                  },
                  "&:active": {
                    color: "secondary.main",
                  },
                }}
              >
                EXIT
              </Typography>
            </Button>
          )}

          {/* Render mobile/tablet view */}
          {/* Render mobile/tablet view */}
          <Stack sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={openMenu}
              sx={{ "&:hover": { color: "#FFB532" } }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              open={Boolean(anchorNav)}
              onClose={closeMenu}
              anchor="right"
              PaperProps={{ style: { width: "40%" } }}
            >
              <Stack>
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    component={button.link ? RouterLink : "button"}
                    to={button.link}
                    onClick={() => {
                      setSelectedItem(button.label); // Set the selected item
                    }}
                    color={
                      selectedItem === button.label ? "secondary" : "inherit"
                    } // Change color if selected
                    sx={{ "&:hover": { color: "#FFB532" } }}
                  >
                    {button.label}
                  </Button>
                ))}
              </Stack>
            </Drawer>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
