import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

const serverUrl = process.env.REACT_APP_API_URL


const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  const [userDatabaseInfo, setUserDatabaseInfo] = React.useState([]);

  const getAccountInfo = async () => {
    const postData = { auth0_user_id: user.sub };
    console.log("Sending POST data:", postData);

    const response = await fetch(serverUrl+"/users/user-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify(postData),
    });
    setUserDatabaseInfo(await response.json());

    console.log(response);
    console.log(userDatabaseInfo);
  };

  useEffect(() => {
    if (isAuthenticated) {
      getAccountInfo();
    }
  }, [isAuthenticated]);

  const handleRemoveAccountClick = async () => {
    const postData = { auth0_user_id: user.sub };
    console.log("Sending POST data:", postData);

    const response = await fetch(serverUrl+"/users/remove-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify(postData),
    });
    console.log("Payload being sent to backend:", JSON.stringify(postData));

    console.log(response);

    if (response.ok) {
      alert("Account removed successfully");
      logout({ returnTo: window.location.origin });
    } else {
      alert("Failed to remove account");
    }
  };

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
          <p>
            <strong>Email:</strong> {user.email || "N/A"}
          </p>
          <p>
            <strong>Nickname:</strong> {user.nickname || "N/A"}
          </p>
          <p>
            <strong>Sub (User ID):</strong> {user.sub || "N/A"}
          </p>
          <p>
            <strong>Email Verified:</strong>{" "}
            {user.email_verified ? "Yes" : "No"}
          </p>
          <p>
            <strong>Given Name:</strong> {user.given_name || "N/A"}
          </p>
          <p>
            <strong>Family Name:</strong> {user.family_name || "N/A"}
          </p>

          <h2>Database Info</h2>

          {userDatabaseInfo.length > 0 ? (
            userDatabaseInfo.map((user, index) => (
              <div key={index}>
                <p>
                  <strong>Database id:</strong> {user.id || "N/A"}
                </p>
                <p>
                  <strong>Database user_id:</strong> {user.user_id || "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p>No database information available</p>
          )}

          <div>
          <button onClick={handleRemoveAccountClick}>Remove account</button>

          </div>
          <div>
          <button onClick={() => navigate('/admin')}>Admin Dash</button>

          </div>



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
