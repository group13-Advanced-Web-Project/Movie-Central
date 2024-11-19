
import React, {useState} from 'react';

function ReviewTable (){

const [testReviewData, setTestReviewData] = useState([


    {id: 1, Review_id: "54456", movie_id: "1", user_id: "5", description: "Great movie", rating: "5", timestamp: "2021-10-10 10:00:00" },

]);

    return(
        <>
        <div>
            <h2>Review Table</h2>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Review ID</th>
                        <th>Movie ID</th>
                        <th>User ID</th>
                        <th>Description</th>
                        <th>Rating</th>
                        <th>Timestamp</th>
              
                      

                    </tr>
                </thead>
                <tbody>
                    {testReviewData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.Review_id}</td>
                            <td>{user.movie_id}</td>
                            <td>{user.user_id}</td>
                            <td>{user.description}</td>
                            <td>{user.rating}</td>
                            <td>{user.timestamp}</td>                       
                        </tr>
                    ))}
                </tbody>
            </table>


           
        </div>
        
        
        </>
    )
}

export default ReviewTable;