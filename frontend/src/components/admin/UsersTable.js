import React, { useState } from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const serverUrl = process.env.REACT_APP_API_URL;

function UsersTable() {
  const { user } = useAuth0();
  const userId = user.sub;
  const [userData, setUserData] = useState([]);

  const getUsersTable = async () => {
    const response = await fetch(serverUrl + "/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
      body: JSON.stringify({ auth0_user_id: userId }),

    });
    setUserData(await response.json());

    // console.log(response);
    // console.log(userData);
  };

  useEffect(() => {
    getUsersTable();
  }, []);

  return (
    <>
      <div>
        <h2>Users Table</h2>
      </div>
      <div   className='table-container'>

        <table className="tables-table">
          <thead>
            <tr>
              <th>id</th>
              <th>user_id</th>
              <th>email</th>
              <th>role</th>
              <th>nickname</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.user_id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.nickname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsersTable;
