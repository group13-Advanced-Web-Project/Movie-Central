import { Router } from "express";
import { pool } from "../../helpers/db.js";
import axios from "axios";

const router = Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchGroupMembers = async (group_id) => {
    const query = `SELECT gm.*, u.nickname
        FROM group_members gm
        JOIN users u ON gm.user_id = u.user_id
        WHERE gm.group_id = $1;`;
    try {
        const result = await pool.query(query, [group_id]);
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch group members", error);
        throw new Error("Failed to fetch group members");
    }
};

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM groups;`
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch groups", details: error.message });
    }
});

// Create a new group
router.post('/', async (req, res) => {
    const {group_name, description, admin} = req.body;

    try {
        await pool.query('BEGIN');

        const result = await pool.query(
            `INSERT INTO groups (group_name, description) VALUES ($1, $2) RETURNING *;`,
            [group_name, description]
        );
        const group_id = result.rows[0].group_id;

        await pool.query(
            `INSERT INTO group_members (group_id, user_id, is_admin, status) VALUES ($1, $2, TRUE, 'accepted');`,
            [group_id, admin]
        );

        await pool.query('COMMIT');
        res.json(result.rows[0]);
    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: "Failed to create group", details: error.message });
    }
});

// Get all groups a user is a member or admin of
router.get('/users/:user_id', async (req, res) => {
    const {user_id} = req.params;

    try {
        const result = await pool.query(
            `SELECT groups.group_id, groups.group_name, group_members.is_admin
            FROM group_members JOIN groups 
            ON group_members.group_id = groups.group_id 
            WHERE group_members.user_id = $1 
            AND group_members.status = 'accepted';`,
            [user_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch groups", details: error.message });
    }
});

// Join a group
router.post('/join', async (req, res) => {
    const {group_id, user_id} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, 'pending') RETURNING *;`,
            [group_id, user_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to join group", details: error.message });
    }
});

// Leave a group
router.delete('/:group_id/members/:user_id', async (req, res) => {
    const {group_id, user_id} = req.params;

    try {
        const adminCheck = await pool.query(
            `SELECT is_admin FROM group_members WHERE group_id = $1 AND user_id = $2 AND is_admin = TRUE;`,
            [group_id, user_id]
        );

        if (adminCheck.rows[0]?.is_admin) {
            const newAdmin = await pool.query(
                `SELECT user_id FROM group_members WHERE group_id = $1 AND user_id != $2 AND status = 'accepted' ORDER BY user_id ASC LIMIT 1;`,
                [group_id, user_id]
            );

            if (newAdmin.rowCount > 0) {

                await pool.query(
                    `UPDATE group_members SET is_admin = FALSE WHERE group_id = $1 AND user_id = $2;`,
                    [group_id, user_id]
                );

                await pool.query(
                    `UPDATE group_members SET is_admin = FALSE WHERE group_id = $1 AND user_id = $2;`,
                    [group_id, user_id]
                );

                await pool.query(
                    `UPDATE group_members SET is_admin = TRUE WHERE group_id = $1 AND user_id = $2;`,
                    [group_id, newAdmin.rows[0].user_id]
                );
            } else {
                return res.status(400).json({ error: "Cannot leave group without assigning a new admin" });
            }
        }

        const result = await pool.query(
            `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING *;`,
            [group_id, user_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to leave group", details: error.message });
    }
});

// Get all members of a group
router.get('/:group_id/members', async (req, res) => {
    const {group_id} = req.params;

    try {
        const result = await fetchGroupMembers(group_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group members", details: error.message });
    }
});

// Get groups by group id
router.get('/:group_id', async (req, res) => {
    const {group_id} = req.params;

    try {
        const result = await pool.query(
            `SELECT groups.group_id, groups.group_name, groups.description, group_members.user_id, group_members.is_admin 
            FROM groups JOIN group_members 
            ON groups.group_id = group_members.group_id 
            WHERE groups.group_id = $1 AND group_members.status = 'accepted';`,
            [group_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Group not found" });
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group", details: error.message });
    }
});

// Get pending member requests by group id
router.get('/:group_id/requests', async (req, res) => {
    const {group_id} = req.params;

    try {
        const result = await pool.query(
            `SELECT group_members.user_id, users.nickname 
            FROM group_members JOIN users 
            ON group_members.user_id = users.user_id 
            WHERE group_id = $1 AND status = 'pending';`,
            [group_id]
        );

        if (result.rowCount === 0) {
            return res.status(202).json({ error: "No pending requests" });
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch requests", details: error.message });
    }
});

// Accept or reject a request to join a group
router.post('/:group_id/update-request', async (req, res) => {
    const {group_id} = req.params;
    const {admin_id, user_id, status} = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use 'accepted' or 'rejected'." });
    }

    try {
        const adminCheck = await pool.query(
            `SELECT is_admin FROM group_members WHERE group_id = $1 AND user_id = $2;`,
            [group_id, admin_id]
        );

        if (!adminCheck.rows[0]?.is_admin) {
            return res.status(403).json({ error: "Only group admins can manage member requests" });
        }

        const result = await pool.query(
            `UPDATE group_members SET status = $1 WHERE group_id = $2 AND user_id = $3 RETURNING *;`,
            [status, group_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Request not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to update request", details: error.message });
    }
});

// Check request status for members
router.get('/:group_id/members/:user_id', async (req, res) => {
    const {group_id, user_id} = req.params;

    try {
        const result = await pool.query(
            `SELECT status FROM group_members WHERE group_id = $1 AND user_id = $2;`,
            [group_id, user_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch request status", details: error.message });
    }
});

// Handle responding to a join request (accept or reject)
router.post('/respond', async (req, res) => {
    const { group_id, user_id, action } = req.body;

    try {
        // Update the group_members table based on the action
        const query = `
            UPDATE group_members
            SET status = $1
            WHERE group_id = $2 AND user_id = $3 AND status = 'pending'
            RETURNING *;
        `;
        const values = [action, group_id, user_id];

        const result = await pool.query(query, values);

        // Check if the request was found and updated
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Join request not found or already processed.' });
        }

        // Respond with success
        return res.status(200).json({ message: `Request ${action}` });

    } catch (error) {
        console.error('Error updating join request:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Backend: Check if the user has a pending/rejected/accepted join request
router.get('/status/:group_id/:user_id', async (req, res) => {
    const { group_id, user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT status 
            FROM group_members 
            WHERE group_id = $1 AND user_id = $2`,
            [group_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.json({ status: 'not-a-member' }); // User has not requested to join
        }

        const { status } = result.rows[0];
        res.json({ status });  // Send back the join request status (pending, accepted, rejected)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch join request status', details: error.message });
    }
});

// Assigning a new admin to a group
router.post('/:group_id/admin', async (req, res) => {
    const { group_id } = req.params;
    const { user_id, admin_id } = req.body;

    try {
        // Check if the user is an admin
        const adminCheck = await pool.query(
            `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND is_admin = TRUE;`,
            [group_id, admin_id]
        );

        if (adminCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Only group admins can assign a new admin.' });
        }

        const existingMemberCheck = await pool.query(
            `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND status = 'accepted';`,
            [group_id, user_id]
        );

        if (existingMemberCheck.rowCount === 0) {
            return res.status(404).json({ error: 'User is not a member of the group.' });
        }

        await pool.query(
            `UPDATE group_members SET is_admin = FALSE WHERE group_id = $1 AND is_admin = TRUE;`,
            [group_id]
        );

        await pool.query(
            `UPDATE group_members SET is_admin = TRUE WHERE group_id = $1 AND user_id = $2;`,
            [group_id, user_id]
        );

        res.json({ message: `New admin is now ${user_id}.` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign a new admin.', details: error.message });
    }
});

// Delete group
router.delete('/:group_id', async (req, res) => {
    const { group_id } = req.params;
    const { admin_id } = req.body;

    try {
        const groupCheck = await pool.query(
            `SELECT * FROM groups WHERE group_id = $1;`,
            [group_id]
        );

        if (groupCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Group not found.' });
        }

        const adminCheck = await pool.query(
            `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND is_admin = TRUE;`,
            [group_id, admin_id]
        );

        if (adminCheck.rowCount === 0) {
            return res.status(403).json({ error: 'Only group admins can delete the group.' });
        }

        await pool.query('BEGIN');

        await pool.query(
            `DELETE FROM group_members WHERE group_id = $1;`,
            [group_id]
        );

        await pool.query(
            `DELETE FROM groups WHERE group_id = $1;`,
            [group_id]
        );

        await pool.query('COMMIT');

        res.json({ message: 'Group deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete group.', details: error.message });
    }
});

// Get movies for group page
router.get('/:group_id/movies', async (req, res) => {
    const { group_id, movie_id } = req.query;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}`,
        {
            headers: {'Authorization': `Bearer ${TMDB_API_KEY}`}
        });

        const movie = {
            movie_id: response.data.id,
            movie_name: response.data.title,
            poster_path: response.data.poster_path? `https://image.tmdb.org/t/p/w500${response.data.poster_path}` : null, 
        };

        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie details.', details: error.message });
    }
});

export default router;