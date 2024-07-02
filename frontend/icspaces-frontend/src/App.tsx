import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import AccountPage from "./pages/AccountPage";
import ViewRoomsPage from "./pages/ViewRoomsPage";
import RoomPage from "./pages/RoomPage";
import RoomPageGuest from "./pages/guest/Room_GuestPage";

import RoomReservationPage from "./pages/RoomReservationPage";

import ReservationsPage from "./pages/ReservationsPage";
import HomePage_Admin from "./pages/admin/HomePage_Admin";
import ReservationsPage_Admin from "./pages/admin/ReservationsPage_Admin";
import EditRoomInfoPage_Admin from "./pages/admin/EditRoomInfoPage_Admin";
import AccountsPage_Admin from "./pages/admin/AccountsPage_Admin";
import SchedulesPage_Admin from "./pages/admin/SchedulesPage_Admin";
import RoomsPage_Admin from "./pages/admin/RoomsPage_Admin";
import BookRoomReservationPage_Admin from "./pages/admin/BookReservationPage_Admin";
import FAQsPage from "./pages/FAQsPage";
import Tracking_GuestPage from "./pages/guest/Tracking_GuestPage";
import AddRoom_Admin from "./pages/admin/AddRoom_Admin";
import ViewRooms_GuestPage from "./pages/guest/ViewRooms_GuestPage";
import Room_GuestPage from "./pages/guest/Room_GuestPage";
import GuestBookingForm_Page from "./pages/guest/GuestBookingForm_Page";
import PrivateRoute from "./utils/PrivateRoute";
import AuthProvider from "./utils/AuthProvider";
import UserLogsPage_Admin from "./pages/admin/UserLogsPage_Admin";
import RevenueReport_Admin from "./pages/admin/RevenueReport_Admin";

//Changes the default theme of the app
const theme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    primary: {
      main: "#183048",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFB532",
      contrastText: "#183048",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Navbar />
            <div className="content">
              <Routes>
                {/* <Route path="/" element={<LoginPage />} /> */}
                <Route
                  path="/"
                  element={<PrivateRoute component={LoginPage} />}
                />

                <Route path="/login-fail" element={<LoginPage />} />

                <Route
                  path="/homepage"
                  element={<PrivateRoute component={HomePage} />}
                />

                <Route
                  path="/accountpage"
                  element={<PrivateRoute component={AccountPage} />}
                />
                <Route
                  path="/viewroomspage"
                  element={<PrivateRoute component={ViewRoomsPage} />}
                />
                <Route path="/roompage/:room_id" element={<RoomPage />} />

                <Route
                  path="/roompageguest/:room_id"
                  element={<RoomPageGuest />}
                />
                <Route
                  path="/roomreservation"
                  element={<PrivateRoute component={RoomReservationPage} />}
                />
                <Route
                  path="/reservationspage"
                  element={<PrivateRoute component={ReservationsPage} />}
                />
                <Route
                  path="//faqspage"
                  element={<PrivateRoute component={FAQsPage} />}
                />
                {/* <Route path="/faqspage" element={<FAQsPage />} /> */}

                <Route
                  path="/homepage_admin"
                  element={<PrivateRoute component={HomePage_Admin} />}
                />
                <Route
                  path="/reservationspage_admin"
                  element={<PrivateRoute component={ReservationsPage_Admin} />}
                />
                <Route
                  path="/editroominfopage_admin/:room_id"
                  element={<EditRoomInfoPage_Admin />}
                />
                <Route
                  path="/roomspage_admin"
                  element={<PrivateRoute component={RoomsPage_Admin} />}
                />
                <Route
                  path="/accountspage_admin"
                  element={<PrivateRoute component={AccountsPage_Admin} />}
                />
                <Route
                  path="/schedulepage"
                  element={<PrivateRoute component={SchedulesPage_Admin} />}
                />
                <Route
                  path="/bookreservationpage_admin"
                  element={
                    <PrivateRoute component={BookRoomReservationPage_Admin} />
                  }
                />
                <Route
                  path="/addroom_admin"
                  element={<PrivateRoute component={AddRoom_Admin} />}
                />

                <Route
                  path="/userlogspage_admin"
                  element={<PrivateRoute component={UserLogsPage_Admin} />}
                />

                <Route
                  path="/revenuereport_admin"
                  element={<PrivateRoute component={RevenueReport_Admin} />}
                />

                <Route
                  path="/reservationtracker_guest"
                  element={<PrivateRoute component={Tracking_GuestPage} />}
                />

                <Route
                  path="/viewrooms_guest"
                  element={<PrivateRoute component={ViewRooms_GuestPage} />}
                />

                <Route
                  path="/room_guest"
                  element={<PrivateRoute component={Room_GuestPage} />}
                />

                <Route
                  path="/roombookingform_guest"
                  element={<PrivateRoute component={GuestBookingForm_Page} />}
                />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
