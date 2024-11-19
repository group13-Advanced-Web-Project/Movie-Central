
import React, {useState} from 'react';

function FavoritesTable (){

const [testFavoritesData, setTestFavoritesData] = useState([


    {id:"1",user_id: 1, fave_1: "54456", fave_2: "12345", fave_3: "67890", fave_4: "617590", },

]);

    return(
        <>
        <div>
            <h2>Favorites Table</h2>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Fave_1</th>
                        <th>Fave_2</th>
                        <th>Fave_3</th>
                        <th>Fave_4</th>

                    </tr>
                </thead>
                <tbody>
                    {testFavoritesData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
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