import axios from 'axios';
const serverUrl = process.env.REACT_APP_API_URL;
//const serverUrl = 'http://localhost:3001';

// Submit a review
export const submitReview = async (review) => {
    try {
        const response = await fetch(`${serverUrl}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });

        if (!response.ok) {
            throw new Error('Failed to submit review');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting review:', error.message);
        throw error;
    }
};


// Fetch reviews by movie_id
export const fetchReviews = async (movie_id) => {
    try {
        const response = await fetch(`${serverUrl}/reviews/movie/${movie_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        throw error;
    }
};


// Fetch all reviews
export const getAllReviews = async () => {
    try {
        const response = await fetch(`${serverUrl}/reviews`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch all reviews');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching all reviews:', error.message);
        throw error;
    }
};

// Fetch all groups with pagination
export const fetchAllGroups = async () => {
    try {
        const response = await fetch(`${serverUrl}/groups`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch all groups');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching all groups:', error.message);
        throw error;
    }
};


// Fetch groups specific to a user
export const fetchUserGroups = async (user_id) => {
    try {
        const response = await fetch(`${serverUrl}/groups/users/${user_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user groups');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user groups:', error.message);
        throw error;
    }
};

// Create a new group
export const createGroup = async (groupData) => {
    try {
        const response = await fetch(`${serverUrl}/groups`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groupData),
        });

        if (!response.ok) {
            throw new Error('Failed to create group');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating group:', error.message);
        throw error;
    }
};

// Fetch group by group_id and include nicknames
export const fetchGroupById = async (group_id) => {
    try {
        const response = await fetch(`${serverUrl}/groups/${group_id}/members`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch group members by ID');
        }

        const rows = await response.json();
        if (rows.length === 0) return null;

        const groupDetails = {
            group_id: rows[0].group_id,
            group_name: rows[0].group_name,
            description: rows[0].description,
            members: rows.map((row) => ({
                user_id: row.user_id,
                nickname: row.nickname,
                is_admin: row.is_admin,
            })),
        };

        groupDetails.members.sort((a, b) => b.is_admin - a.is_admin);

        return groupDetails;
    } catch (error) {
        console.error('Error fetching group by ID:', error.message);
        throw error;
    }
};

// Send join request to a group
export const sendJoinRequest = async (group_id, user_id) => {
    console.log('Sending payload:', { group_id, user_id }); // Debugging log
    try {
        const response = await fetch(`${serverUrl}/groups/join`, {
            method: 'POST',
            body: JSON.stringify({ group_id, user_id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Server returned an error:', errorDetails);
            throw new Error(errorDetails.message || 'Failed to send join request');
        }
        console.log('Join request successful');
    } catch (error) {
        console.error('Error in sendJoinRequest:', error.message);
        throw new Error(error.message);
    }
};

// Fetch pending requests for a group
export const fetchPendingRequests = async (group_id) => {
    try {
        const response = await fetch(`${serverUrl}/groups/${group_id}/requests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch pending requests');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Respond to a join request
export const respondToRequest = async (group_id, user_id, action) => {
    const response = await fetch(`${serverUrl}/groups/respond`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id, user_id, action }),
    });

    if (!response.ok) {
        throw new Error('Failed to respond to request');
    }

    return response.json();
};

// Endpoint to fetch the join request status for a specific user and group
export const checkJoinRequestStatus = async (group_id, user_id) => {
    try {
        const response = await fetch(`${serverUrl}/groups/status/${group_id}/${user_id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch join request status');
        }

        const data = await response.json();
        return data.status || 'not-a-member'; // If no status, default to 'not-a-member'
    } catch (error) {
        console.error('Error fetching join request status:', error);
        throw error;
    }
};

// Fetch group information
export const fetchGroupInfo = async (group_id) => {
    try {
        const response = await fetch(`${serverUrl}/groups/${group_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch group information');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching group information:', error.message);
        throw error;
    }
};

// fetch group members
export const fetchGroupMembers = async (group_id) => {
    try {
        const response = await fetch(`${serverUrl}/groups/${group_id}/members`);
        if (!response.ok) {
            throw new Error('Failed to fetch group members');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching group members:', error.message);
        throw error;
    }
};


//Remove member from group
export const removeMember= async (group_id, user_id) => {
    try {
        const response = await fetch(`${serverUrl}/groups/${group_id}/members/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove member');
        }
        return await response.json();
    } catch (error) {
        console.error('Error removing member:', error);
        throw error;
    }
}

// Delete group
export const deleteGroup = async (group_id, admin_id) => {
    const response = await axios.delete(`${serverUrl}/groups/${group_id}`, {
        data: { admin_id },
    });
    return response.data;
};