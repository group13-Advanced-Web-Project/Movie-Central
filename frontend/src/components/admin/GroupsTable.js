
import React, {useState} from 'react';
import { useEffect } from 'react';

const serverUrl = process.env.REACT_APP_API_URL


function GroupsTable (){

const [groupsData, setGroupsData] = useState([]);


const getGroupsTable = async () => {
 
   

    const response = await fetch(serverUrl+"/admin/Groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
     
    });
    setGroupsData(await response.json());

    // console.log(response);
    // console.log(groupsData);
  };

  useEffect(() => {
  
      getGroupsTable();
    
  }, []);

    return(
        <>
        <div>
            <h2>Groups Table</h2>
        </div>
        <div>
            <table className='tables-table'>
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
                    {groupsData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.group_id}</td>
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