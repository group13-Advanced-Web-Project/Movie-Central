import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import React from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import UsersTable from "../../components/admin/UsersTable";
import FavoritesTable from "../../components/admin/FavoritesTable";
import MovieTable from "../../components/admin/MovieTable";
import ReviewTable from "../../components/admin/ReviewTable";
import GroupsTable from "../../components/admin/GroupsTable";

const serverUrl = process.env.REACT_APP_API_URL



function AdminPage(){
  const { user, isAuthenticated } = useAuth0(); 

    const [adminAuthenticated, setAdminAuthenticated] = React.useState(false);

    const handleAuthenticateAdmin = async () => {
        const userId = user.sub;
        console.log("Authenticating user with ID:", userId);

        const response = await fetch(serverUrl+"/admin/authenticate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
            },
            body: JSON.stringify({ auth0_user_id: userId })
        });

        console.log(response);

        if (response.ok) {
            setAdminAuthenticated(true);
            return response;
        } else {
            setAdminAuthenticated(false);
            return response;
        }
    }
    
    useEffect(() => {
        if (isAuthenticated && !adminAuthenticated) {
            handleAuthenticateAdmin().then((response) => {
                console.log("Admin authentication response:", response);
            });
        }
    }, [isAuthenticated, adminAuthenticated]);


    return(
        <div className="home-container">
      <Navbar />
      <div className="home-main-content">
        {adminAuthenticated ? (
            <p>Admin authenticated</p>
        ) : (
          <p>Admin not authenticated</p>
        )}
      </div>

      {adminAuthenticated ? (
            <div>
                <UsersTable />
                <FavoritesTable />
                <MovieTable />
                <ReviewTable />
                <GroupsTable />



            </div>
        ) : (
          <p></p>
        )}

      <Footer />
      </div>
    )
}

export default AdminPage;