
import React, {useState} from 'react';

function GroupsTable (){

const [testGroupsData, setTestGroupsData] = useState([


    {id: 1, Groups_id: "54456", member_1: "1", member_2:"2", member_3:"3", member_4:"4"  },

]);

    return(
        <>
        <div>
            <h2>Groups Table</h2>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Groups ID</th>
                        <th>Member 1</th>
                        <th>Member 2</th>
                        <th>Member 3</th>
                        <th>Member 4</th>


                      

                    </tr>
                </thead>
                <tbody>
                    {testGroupsData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.Groups_id}</td>
                            <td>{user.member_1}</td>
                            <td>{user.member_2}</td>
                            <td>{user.member_3}</td>
                            <td>{user.member_4}</td>
                        
                          
                        </tr>
                    ))}
                </tbody>
            </table>


           
        </div>
        
        
        </>
    )
}

export default GroupsTable;