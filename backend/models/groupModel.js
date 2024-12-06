import { pool } from "../helpers/db.js";

export const getAllGroups = async () => {
    const query = `SELECT * FROM groups;`;
    return await pool.query(query);
};

export const createGroup = async (group_name, description, admin_id) => {
    await pool.query('BEGIN');
    const result = await pool.query(
        `INSERT INTO groups (group_name, description) VALUES ($1, $2) RETURNING *;`,
        [group_name, description]
    );
    const group_id = result.rows[0].group_id;

    await pool.query(
        `INSERT INTO group_members (group_id, user_id, is_admin, status) VALUES ($1, $2, TRUE, 'accepted');`,
        [group_id, admin_id]
    );
    await pool.query('COMMIT');
    return result.rows[0];
};

export const getGroupById = async (group_id) => {
    const query = `
        SELECT groups.group_id, groups.group_name, groups.description, group_members.user_id, group_members.is_admin 
        FROM groups 
        JOIN group_members ON groups.group_id = group_members.group_id 
        WHERE groups.group_id = $1 AND group_members.status = 'accepted';`;
    return await pool.query(query, [group_id]);
};

export const addMemberToGroup = async (group_id, user_id) => {
    const query = `
        INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, 'pending') RETURNING *;`;
    return await pool.query(query, [group_id, user_id]);
};

export const getUserGroups = async (user_id) => {
    const query = `
        SELECT groups.group_id, groups.group_name, groups.description, group_members.user_id, group_members.is_admin 
        FROM groups 
        JOIN group_members ON groups.group_id = group_members.group_id 
        WHERE group_members.user_id = $1 AND group_members.status = 'accepted';`;
    return await pool.query(query, [user_id]);
};

export const adminCheck = async (groupId, userId) => {
    return pool.query(
        `SELECT is_admin FROM group_members WHERE group_id = $1 AND user_id = $2 AND is_admin = TRUE;`,
        [groupId, userId]
    );
};

export const findNewAdmin = async (groupId, userId) => {
    return pool.query(
        `SELECT user_id FROM group_members WHERE group_id = $1 AND user_id != $2 AND status = 'accepted' ORDER BY user_id ASC LIMIT 1;`,
        [groupId, userId]
    );
};

export const updateAdminStatus = async (groupId, userId, isAdmin) => {
    return pool.query(
        `UPDATE group_members SET is_admin = $1 WHERE group_id = $2 AND user_id = $3;`,
        [isAdmin, groupId, userId]
    );
};

export const deleteGroupMember = async (groupId, userId) => {
    return pool.query(
        `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING *;`,
        [groupId, userId]
    );
};

export const fetchGroupMembers = async (groupId) => {
    const query = `
        SELECT gm.*, u.nickname
        FROM group_members gm
        JOIN users u ON gm.user_id = u.user_id
        WHERE gm.group_id = $1;
    `;
    try {
        const result = await pool.query(query, [groupId]);
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch group members", error);
        throw new Error("Failed to fetch group members");
    }
};

export const fetchPendingRequests = async (groupId) => {
    return pool.query(
        `SELECT group_members.user_id, users.nickname
         FROM group_members 
         JOIN users ON group_members.user_id = users.user_id
         WHERE group_id = $1 AND status = 'pending';`,
        [groupId]
    );
};

export const checkIfAdmin = async (groupId, adminId) => {
    return pool.query(
        `SELECT is_admin 
         FROM group_members 
         WHERE group_id = $1 AND user_id = $2;`,
        [groupId, adminId]
    );
};

export const respondToRequest = async (groupId, userId, action) => {
    const query = `
        UPDATE group_members
        SET status = $1
        WHERE group_id = $2 AND user_id = $3 AND status = 'pending'
        RETURNING *;
    `;
    const values = [action, groupId, userId];
    const result = await pool.query(query, values);
    return result.rows;
};

export const getJoinRequestStatus = async (groupId, userId) => {
    const query = `SELECT status FROM group_members WHERE group_id = $1 AND user_id = $2`;
    const result = await pool.query(query, [groupId, userId]);
    return result.rows.length > 0 ? result.rows[0].status : 'not-a-member';
};

export const checkIfMember = async (groupId, userId) => {
    const query = `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND status = 'accepted'`;
    const result = await pool.query(query, [groupId, userId]);
    return result.rowCount > 0;
};

export const assignNewAdmin = async (groupId, userId) => {
    await pool.query(`UPDATE group_members SET is_admin = FALSE WHERE group_id = $1 AND is_admin = TRUE`, [groupId]);
    await pool.query(`UPDATE group_members SET is_admin = TRUE WHERE group_id = $1 AND user_id = $2`, [groupId, userId]);
};

export const deleteGroup = async (group_id, admin_id) => {
    try {
        // Begin transaction
        await pool.query('BEGIN');

        // Check if the group exists
        const groupCheck = await pool.query(
            `SELECT * FROM groups WHERE group_id = $1;`,
            [group_id]
        );

        if (groupCheck.rowCount === 0) {
            await pool.query('ROLLBACK');
            throw new Error('Group not found.');
        }

        // Check if the user is an admin of the group
        const adminCheck = await pool.query(
            `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND is_admin = TRUE;`,
            [group_id, admin_id]
        );

        if (adminCheck.rowCount === 0) {
            await pool.query('ROLLBACK');
            throw new Error('Only group admins can delete the group.');
        }

        // Delete all members from the group
        await pool.query(
            `DELETE FROM group_members WHERE group_id = $1;`,
            [group_id]
        );

        // Delete the group
        await pool.query(
            `DELETE FROM groups WHERE group_id = $1;`,
            [group_id]
        );

        // Commit the transaction
        await pool.query('COMMIT');
    } catch (error) {
        // Rollback the transaction in case of any error
        await pool.query('ROLLBACK');
        throw error;
    }
};

export const addMovieToGroup = async (groupId, movieId) => {
    const query = `INSERT INTO group_movies (group_id, movie_id) VALUES ($1, $2);`;
    await pool.query(query, [groupId, movieId]);
};

export const getMoviesForGroup = async (groupId) => {
    const query = `SELECT movie_id FROM group_movies WHERE group_id = $1`;
    const result = await pool.query(query, [groupId]);
    return result.rows;
};
