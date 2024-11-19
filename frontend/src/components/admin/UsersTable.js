import React, { useState } from "react";
import { useEffect } from "react";

const serverUrl = process.env.REACT_APP_API_URL;

function UsersTable() {
  const [userData, setUserData] = useState([]);

  const getUsersTable = async () => {
    const response = await fetch(serverUrl + "/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
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
        <h2>User Table</h2>
      </div>
      <div>
        <table className="tables-table">
          <thead>
            <tr>
              <th>id</th>
              <th>user_id</th>
              <th>role</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.user_id}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UsersTable;
