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

// Fetch group by group_id
export const fetchGroupById = async (group_id) => {
    try {
        const response = await fetch(`${serverUrl}/groups/${group_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch group by ID');
        }

        // Backend returns multiple rows; process them here
        const rows = await response.json();
        if (rows.length === 0) return null;

        const groupDetails = {
            group_id: rows[0].group_id,
            group_name: rows[0].group_name,
            description: rows[0].description,
            members: rows.map((row) => ({
                user_id: row.user_id,
                is_admin: row.is_admin,
            })),
        };

        // Sort members to ensure the admin is listed first
        groupDetails.members.sort((a, b) => b.is_admin - a.is_admin);

        return groupDetails;
    } catch (error) {
        console.error('Error fetching group by ID:', error.message);
        throw error;
    }
};
