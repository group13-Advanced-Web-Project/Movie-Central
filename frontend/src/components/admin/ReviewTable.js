
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
        <div   className='table-container'>
     
            <table className='tables-table'>
                <thead>
                    <tr>
                     
                        <th>review_id</th>
                        <th>movie_id</th>
                        <th>name</th>
                        <th>user_id</th>
                        <th>email</th>
                        <th>description</th>
                        <th>rating</th>
                        <th>timestamp</th>

              
                      

                    </tr>
                </thead>
                <tbody>
                    {reviewData.map((user, index) => (
                        <tr key={index}>
                         
                            <td>{user.review_id}</td>
                            <td>{user.movie_id}</td>
                            <td>{user.movie_name}</td>
                            <td>{user.user_id}</td>
                            <td>{user.user_email}</td>
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