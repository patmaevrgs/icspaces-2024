import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RoomFilterProvider } from "../components/RoomFilterContext";
import { CircularProgress } from "@mui/material";
import RoomFilters from "../components/RoomFilters";
import ViewRoomsPage from "../pages/guest/ViewRooms_GuestPage";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
}

const userTypeRoutes: { [key: number]: string[] } = {
  0: [
    "/homepage",
    "/viewroomspage",
    "/reservationspage",
    "/accountpage",
    "/faqspage",
    "/roomreservation",
    "/roompage",
  ],
  1: [
    "/homepage",
    "/viewroomspage",
    "/reservationspage",
    "/accountpage",
    "/faqspage",
    "/schedulepage",
    "/roomreservation",
    "/roompage/:room_id",
  ],
  2: [
    "/homepage_admin",
    "/reservationspage_admin",
    "/editroominfopage_admin",
    "/roomspage_admin",
    "/accountspage_admin",
    "/schedulepage",
    "/bookreservationpage_admin",
    "/accountpage",
    "/bookroom_admin",
    "/roomreservation",
    "/addroom_admin",
    "/userlogspage_admin",
    "/revenuereport_admin",
  ],
  3: [
    "/homepage_admin",
    "/reservationspage_admin",
    "/editroominfopage_admin",
    "/roomspage_admin",
    "/accountspage_admin",
    "/schedulepage",
    "/bookreservationpage_admin",
    "/accountpage",
    "/bookroom_admin",
    "/roomreservation",
    "/addroom_admin",
    "/userlogspage_admin",
    "/revenuereport_admin",
  ],

  // Add more user types and routes as needed
};

const notLoggedInRoutes = [
  "/",
  "/reservationtracker_guest",
  "/viewrooms_guest",
  "/roombookingform_guest",
  "/room_guest",
  "/faqspage",
];

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const [userType, setUserType] = useState<number | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState<null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = async () => {
    const response = await fetch("http://localhost:3001/is-logged-in", {
      credentials: "include",
    });
    const data = await response.json();
    setIsLoggedIn(data.isLoggedIn);
  };

  checkLoginStatus();

  const fetchProfileData = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-profile", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("User Type:", data);

      if (data.success) {
        setUserType(data.data.usertype);
        setIsFirstLogin(data.data.isFirstLogin);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      setIsLoading(false);
    }
  };

  fetchProfileData();

  // useEffect(() => {
  //   checkLoginStatus();
  //   if (!isLoading) {
  //     if (
  //       isFirstLogin === 1 &&
  //       location.pathname !== "/homepage" &&
  //       isLoggedIn
  //     ) {
  //       navigate("/homepage");
  //       console.log("YOU'RE REPEATING 1");
  //       return;
  //     } else if (isLoggedIn && userType !== null) {
  //       console.log("A", isLoggedIn);
  //       const accessibleRoutes = userTypeRoutes[userType];
  //       if (
  //         !accessibleRoutes.includes(location.pathname) ||
  //         notLoggedInRoutes.includes(location.pathname)
  //       ) {
  //         console.log("B");
  //         if (userType === 0 || userType === 1) {
  //           console.log("C");
  //           if (!accessibleRoutes.includes(location.pathname)) {
  //             navigate("/homepage");
  //             return;
  //           }
  //         } else if (userType === 2 || userType === 3) {
  //           if (!accessibleRoutes.includes(location.pathname)) {
  //             navigate("/homepage_admin");
  //             return;
  //           }
  //         }
  //       }
  //     } else if (!isLoggedIn) {
  //       console.log("YOU'RE REPEATING 1");

  //       if (!notLoggedInRoutes.includes(location.pathname)) {
  //         navigate("/");
  //       }
  //     }
  //   }
  // }, [
  //   isLoading,
  //   userType,
  //   navigate,
  //   location.pathname,
  //   isLoggedIn,
  //   isFirstLogin,
  // ]);

  useEffect(() => {
    checkLoginStatus();
    if (!isLoading) {
      if (
        isFirstLogin === 1 &&
        location.pathname !== "/homepage" &&
        (userType === 0 || userType === 1) &&
        isLoggedIn
      ) {
        navigate("/homepage");
        console.log("YOU'RE REPEATING 1");
        return;
      } else if (isLoggedIn && userType !== null) {
        console.log("A", isLoggedIn);
        const accessibleRoutes = userTypeRoutes[userType];
        console.log("ROUTES", accessibleRoutes);
        console.log("YOU'RE IN", location.pathname);
        if (
          !accessibleRoutes.includes(location.pathname) ||
          notLoggedInRoutes.includes(location.pathname)
        ) {
          console.log("B");
          if (userType === 0 || userType === 1) {
            console.log("C");
            if (!accessibleRoutes.includes(location.pathname)) {
              navigate("/homepage");
              return;
            }
          } else if (userType === 2 || userType === 3) {
            console.log("D");
            if (!accessibleRoutes.includes(location.pathname)) {
              console.log("HERE");
              navigate("/homepage_admin");
              return;
            }
          }
        }
      } else if (!isLoggedIn) {
        console.log("YOU'RE REPEATING 1");

        if (!notLoggedInRoutes.includes(location.pathname)) {
          navigate("/");
        }
      }
    }
  }, [
    isLoading,
    userType,
    navigate,
    location.pathname,
    isLoggedIn,
    isFirstLogin,
  ]);
  return isLoading ? (
    <CircularProgress /> // Show loading spinner when isLoading is true
  ) : isLoggedIn ? (
    <RoomFilterProvider>
      <Component />
    </RoomFilterProvider>
  ) : notLoggedInRoutes.includes(location.pathname) ? (
    <RoomFilterProvider>
      <Component />
    </RoomFilterProvider>
  ) : null;
};

export default PrivateRoute;
