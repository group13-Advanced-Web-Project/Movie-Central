
import React, {useState} from 'react';

function UsersTable (){

const [testUserData, setTestUserData] = useState([

    {user_id: 1, role: "admin"},
    {user_id: 2, role: "user"},
    {user_id: 3, role: "user"},
    {user_id: 4, role: "user"},
    {user_id: 5, role: "user"},
    {user_id: 6, role: "user"},

]);

    return(
        <>
        <div>
            <h2>User Table</h2>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {testUserData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.user_id}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


           
        </div>
        
        
        </>
    )
}

export default UsersTable;