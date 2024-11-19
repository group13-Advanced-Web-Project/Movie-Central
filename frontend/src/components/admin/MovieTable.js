
import React, {useState} from 'react';

function MovieTable (){

const [testMovieData, setTestMovieData] = useState([


    {id: 1, movie_id: "54456", review_1: "1", review_2: "5" },

]);

    return(
        <>
        <div>
            <h2>Movie Table</h2>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Movie ID</th>
                        <th>Review 1</th>
                        <th>Review 2</th>
                      

                    </tr>
                </thead>
                <tbody>
                    {testMovieData.map((user, index) => (
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