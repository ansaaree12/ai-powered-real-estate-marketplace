import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";
import Chatbot from "../Chatbot/Chatbot"; // Import the Chatbot component

const Layout = () => {
  useFavourites();
  useBookings();

  const { isAuthenticated, user, getAccessTokenWithPopup } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token),
  });

  useEffect(() => {
    const getTokenAndRegister = async () => {
      try {
        const res = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: "https://dev-yb031yf6nqzlmezk.us.auth0.com/api/v2/", // Correct API Identifier
            scope: "openid profile email", // Add other required scopes if necessary
          },
        });
        localStorage.setItem("access_token", res);
        setUserDetails((prev) => ({ ...prev, token: res }));
        mutate(res); // Use mutate function here
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    if (isAuthenticated) {
      getTokenAndRegister();
    }
  }, [isAuthenticated, getAccessTokenWithPopup, setUserDetails, mutate]);

  return (
    <>
      <div style={{ background: "var(--black)" }}>
        {/* Header is displayed on all pages */}
        <Header />

        {/* This renders the current route's content */}
        <Outlet />

        {/* Add the Chatbot here */}
        <Chatbot />
      </div>

      {/* Footer is displayed on all pages */}
      <Footer />
    </>
  );
};

export default Layout;
