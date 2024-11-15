import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0(); 
  const { logout } = useAuth0();


  const handleRemoveAccountClick = async () => {
    if (window.confirm("Are you sure you want to remove your account?")) {
      const response = await fetch("http://localhost:3001/remove-account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
        },
      });
      if (response.ok) {
        alert("Account removed successfully");
        logout({ returnTo: window.location.origin });
      } else {
        alert("Failed to remove account");
      }
    }
  }

  return (
    <>
      {isAuthenticated ? (
        <div>
          <Navbar />
          <h1>Profile - Logged In</h1>
          <h2>Auth0 Details</h2>
          <img 
            src={user.picture} 
            alt={user.name} 
            style={{ width: "150px", borderRadius: "50%" }} 
          />
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Nickname:</strong> {user.nickname}</p>
          <p><strong>Sub (User ID):</strong> {user.sub}</p>
          <p><strong>Email Verified:</strong> {user.email_verified ? "Yes" : "No"}</p>
          <p><strong>Given Name:</strong> {user.given_name}</p>
          <p><strong>Family Name:</strong> {user.family_name}</p>

          <h2>Database Info</h2>

     <button onClick={handleRemoveAccountClick}>Remove account</button>

          <Footer />
        </div>
      ) : (
        <div>
          <Navbar />
          <h1>Profile</h1>
          <p>Log in to see your profile</p>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Profile;
