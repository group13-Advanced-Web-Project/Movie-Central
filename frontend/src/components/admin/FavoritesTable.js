
import React, {useState} from 'react';
import { useEffect } from 'react';


const serverUrl = process.env.REACT_APP_API_URL


function FavoritesTable (){

const [favoritesData, setFavoritesData] = useState([]);


const getFavoritesTable = async () => {
 
   

    const response = await fetch(serverUrl+"/admin/favorites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
     
    });
    setFavoritesData(await response.json());

    // console.log(response);
    // console.log(favoritesData);
  };

  useEffect(() => {
  
      getFavoritesTable();
    
  }, []);

    return(
        <>
        <div>
            <h2>Favorites Table</h2>
        </div>
        <div>
            <table className='tables-table'>
                <thead>
                    <tr c>
                        <th>id</th>
                        <th>user_id</th>
                        <th>fave_1</th>
                        <th>fave_2</th>
                        <th>fave_3</th>
                        <th>fave_4</th>

                    </tr>
                </thead>
                <tbody >
                    {favoritesData.map((user, index) => (
                        <tr  key={index}>
                            <td >{user.id}</td>
                            <td>{user.user_id}</td>
                            <td>{user.fave_1}</td>
                            <td>{user.fave_2}</td>
                            <td>{user.fave_3}</td>
                            <td>{user.fave_4}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


           
        </div>
        
        
        </>
    )
}

export default FavoritesTable;