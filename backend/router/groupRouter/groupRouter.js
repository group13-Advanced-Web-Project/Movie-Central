import { Router } from "express";
import { pool } from "../../helpers/db.js";

const router = Router();

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
            `SELECT groups.group_id, groups.group_name 
            FROM group_members JOIN groups 
            ON group_members.group_id = groups.group_id 
            WHERE group_members.user_id = $1;`,
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
            return res.status(404).json({ error: "No pending requests found" });
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

export default router;