import React, { useState } from "react";
import { useEffect } from "react";

const serverUrl = process.env.REACT_APP_API_URL;

function GroupMembersTable() {
    const [groupMembersData, setGroupMembersData] = useState([]);

    const getGroupsTable = async () => {
        const response = await fetch(serverUrl + "/admin/Group_members", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
            },
        });
        setGroupMembersData(await response.json());
    };

    useEffect(() => {
        getGroupsTable();
    }, []);

    return (
        <>
            <div>
                <h2>Group_Members Table</h2>
            </div>
            <div className="table-container">
                <table className="tables-table">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>group_id</th>
                            <th>user_id</th>
                            <th>is_admin</th>
                            <th>status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupMembersData.map((user, index) => (
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.group_id}</td>
                                <td>{user.user_id}</td>
                                <td>{user.is_admin ? "true" : "false"}</td>
                                <td>{user.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default GroupMembersTable;
