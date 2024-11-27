import { Router } from "express";
import { pool } from "../../helpers/db.js";

const router = Router();

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
            `SELECT * FROM group_members WHERE user_id = $1;`,
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

// Accept or reject a request to join a group
router.post('/:group_id/members/:user_id', async (req, res) => {
    const {group_id, user_id} = req.params;
    const {status, admin_id} = req.body;

    if (status !== "accepted" && status !== "rejected") {
        return res.status(400).json({ error: "Invalid status" });
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
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to accept/reject request", details: error.message });
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
        const result = await pool.query(
            `SELECT * FROM group_members WHERE group_id = $1;`,
            [group_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group members", details: error.message });
    }
});

export default router;