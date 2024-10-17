import React, { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = ({ setUser }) => {

  const navigate = useNavigate();
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "345268998486-b5q60ibbcn446c8egalgcdveuggthdtq.apps.googleusercontent.com",  // Replace with your client ID
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    // Handle the token returned by Google
    console.log("Encoded JWT ID token: " + response);

    // You can decode the JWT for user info
    const userObject = jwtDecode(response.credential);
    localStorage.setItem("info", JSON.stringify(userObject));
    console.log(userObject);
    setUser(userObject);
    navigate("/");
  };

  return (
    <button id="google-signin-button"></button>
  );
};

export default GoogleLoginButton;
