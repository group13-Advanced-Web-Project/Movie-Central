
import React, {useState} from 'react';
import { useEffect } from 'react';

const serverUrl = process.env.REACT_APP_API_URL


function ReviewTable (){

const [reviewData, setReviewData] = useState([]);

const getReviewTable = async () => {
 
   

    const response = await fetch(serverUrl+"/admin/review", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth0:id_token")}`,
      },
     
    });
    setReviewData(await response.json());

    // console.log(response);
    // console.log(reviewData);
  };

  useEffect(() => {
  
      getReviewTable();
    
  }, []);

    return(
        <>
        <div>
            <h2>Review Table</h2>
        </div>
        <div>
            <table className='tables-table'>
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
                    {reviewData.map((user, index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.review_id}</td>
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