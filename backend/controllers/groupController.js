import * as GroupModel from "../models/groupModel.js";
import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Get all groups
export const getGroups = async (req, res) => {
    try {
        const result = await GroupModel.getAllGroups();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch groups", details: error.message });
    }
};

// Create a new group
export const createGroup = async (req, res) => {
    const { group_name, description, admin } = req.body;
    try {
        const newGroup = await GroupModel.createGroup(group_name, description, admin);
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: "Failed to create group", details: error.message });
    }
};

// Get group by id
export const getGroupById = async (req, res) => {
    const { group_id } = req.params;
    try {
        const result = await GroupModel.getGroupById(group_id);
        if (result.rowCount === 0) return res.status(404).json({ error: "Group not found" });
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group", details: error.message });
    }
};

// Join a group
export const joinGroup = async (req, res) => {
    const { group_id, user_id } = req.body;
    try {
        const result = await GroupModel.addMemberToGroup(group_id, user_id);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to add member", details: error.message });
    }
};

// Get all groups of a user
export const getAllUserGroups = async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await GroupModel.getUserGroups(user_id);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch groups", details: error.message });
    }
};

// Delete user from group
export const leaveGroup = async (req, res) => {
    const { group_id, user_id } = req.params;

    try {
        const adminCheck = await GroupModel.adminCheck(group_id, user_id);

        if (adminCheck.rows[0]?.is_admin) {
            const newAdmin = await GroupModel.findNewAdmin(group_id, user_id);

            if (newAdmin.rowCount > 0) {
                await GroupModel.updateAdminStatus(group_id, user_id, false);
                await GroupModel.updateAdminStatus(group_id, newAdmin.rows[0].user_id, true);
            } else {
                return res.status(400).json({ error: "Cannot leave group without assigning a new admin" });
            }
        }

        const result = await GroupModel.deleteGroupMember(group_id, user_id);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found in the group" });
        }

        res.json({ message: "Successfully left the group", member: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Failed to leave group", details: error.message });
    }
};

// Get all members of a group
export const getGroupMembers = async (req, res) => {
    const { group_id } = req.params;
    try {
        const members = await GroupModel.fetchGroupMembers(group_id);
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group members", details: error.message });
    }
};

// Get pending requests by group ID
export const getPendingRequests = async (req, res) => {
    const { group_id } = req.params;
    try {
        const result = await GroupModel.fetchPendingRequests(group_id);
        if (result.rowCount === 0) {
            return res.status(202).json({ message: "No pending requests" });
        }
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch requests", details: error.message });
    }
};

// Accept or reject a request to join a group
export const updateRequestStatus = async (req, res) => {
    const { group_id } = req.params;
    const { admin_id, user_id, status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use 'accepted' or 'rejected'." });
    }

    try {
        const adminCheck = await GroupModel.checkIfAdmin(group_id, admin_id);
        if (!adminCheck.rows[0]?.is_admin) {
            return res.status(403).json({ error: "Only group admins can manage member requests." });
        }

        const result = await GroupModel.updateMemberRequest(group_id, user_id, status);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Request not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to update request", details: error.message });
    }
};

// Check if the user has a pending/rejected/accepted join request
export const getJoinRequestStatus = async (req, res) => {
    const { group_id, user_id } = req.params;
    try {
        const status = await GroupModel.getJoinRequestStatus(group_id, user_id);
        res.json({ status });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch join request status', details: error.message });
    }
};

// Assign a new admin to the group
export const assignNewAdmin = async (req, res) => {
    const { group_id } = req.params;
    const { user_id, admin_id } = req.body;

    try {
        const adminCheck = await GroupModel.checkIfAdmin(group_id, admin_id);
        if (!adminCheck.rows[0]?.is_admin) {
            return res.status(403).json({ error: "Only group admins can assign new admin." });
        }

        const isMember = await GroupModel.checkIfMember(group_id, user_id);
        if (!isMember) {
            return res.status(404).json({ error: 'User is not a member of the group.' });
        }

        await GroupModel.assignNewAdmin(group_id, user_id);
        res.json({ message: `New admin is now ${user_id}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign a new admin.', details: error.message });
    }
};

// Delete a group
export const deleteGroup = async (req, res) => {
    const { group_id } = req.params;
    const { admin_id } = req.body;

    try {
        // Call the model function to delete the group
        await GroupModel.deleteGroup(group_id, admin_id);

        // Send success response
        res.json({ message: 'Group deleted successfully.' });
    } catch (error) {
        // Handle error and send response
        res.status(500).json({ error: error.message });
    }
};

// Add movie to group
export const addMovieToGroup = async (req, res) => {
    const { group_id } = req.params;
    const { movie_id } = req.body;

    try {
        // Fetch movie details from TMDB API
        const movieResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}`,
            {
                headers: { 'Authorization': `Bearer ${TMDB_API_KEY}` }
            }
        );

        if (movieResponse.status !== 200) {
            return res.status(404).json({ error: 'Invalid movie id. Movie not found.' });
        }

        // Add movie to the group
        await GroupModel.addMovieToGroup(group_id, movie_id);
        res.json({ message: 'Movie added to group.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add movie to group.', details: error.message });
    }
};

// Get movies for group page
export const getMoviesForGroup = async (req, res) => {
    const { group_id } = req.params;

    try {
        // Get movie IDs for the group
        const groupMovies = await GroupModel.getMoviesForGroup(group_id);

        if (groupMovies.length === 0) {
            return res.status(404).json({ error: 'No movies found for this group.' });
        }

        // Fetch movie details from TMDB API
        const response = groupMovies.map(({ movie_id }) =>
            axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}`, {
                headers: { 'Authorization': `Bearer ${TMDB_API_KEY}` }
            })
        );

        const movieResponses = await Promise.all(response);
        const movieDetails = movieResponses.map(response => ({
            movie_id: response.data.id,
            movie_name: response.data.title,
            poster_path: response.data.poster_path ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}` : null,
        }));

        res.json(movieDetails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie details.', details: error.message });
    }
};
