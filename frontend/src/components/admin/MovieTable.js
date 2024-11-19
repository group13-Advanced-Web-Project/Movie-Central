
import React, {useState} from 'react';
import { useEffect } from 'react';


const serverUrl = process.env.REACT_APP_API_URL


function MovieTable (){

const [movieData, setMovieData] = useState([]);


const getMovieTable = async () => {
 
   

    const response = await fetch(serverUrl+"/admin/movie", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
     
    });
    setMovieData(await response.json());

    // console.log(response);
    // console.log(movieData);
  };

  useEffect(() => {
  
      getMovieTable();
    
  }, []);

    return(
        <>
        <div>
            <h2>Movie Table</h2>
        </div>
        <div>
            <table className='tables-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Movie ID</th>
                        <th>Review 1</th>
                        <th>Review 2</th>
                      

                    </tr>
                </thead>
                <tbody>
                    {movieData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.movie_id}</td>
                            <td>{user.review_1}</td>
                            <td>{user.review_2}</td>
                          
                        </tr>
                    ))}
                </tbody>
            </table>


           
        </div>
        
        
        </>
    )
}

export default MovieTable;