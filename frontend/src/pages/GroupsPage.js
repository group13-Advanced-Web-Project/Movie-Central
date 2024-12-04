import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createGroup, fetchAllGroups, fetchUserGroups, sendJoinRequest, checkJoinRequestStatus, deleteGroup } from '../utils/api';
import { Link } from 'react-router-dom';
import '../styles/Groups.css';

function GroupsPage() {
    const [allGroups, setAllGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [joinRequestStatus, setJoinRequestStatus] = useState({});
    const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [deleteGroupId, setDeleteGroupId] = useState(null);  
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); 

    const { user, isAuthenticated, loginWithRedirect } = useAuth0();

    useEffect(() => {
        const loadAllGroups = async () => {
            setLoading(true);
            try {
                const allGroupsData = await fetchAllGroups();
                setAllGroups(allGroupsData);
            } catch (error) {
                setError('Failed to load groups. Please try again later.');
                console.error('Failed to load all groups:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAllGroups();
    }, []);

    useEffect(() => {
        if (isAuthenticated && user?.sub) {
            const loadUserGroups = async () => {
                try {
                    const userGroupsData = await fetchUserGroups(user.sub);
                    setMyGroups(userGroupsData);
                } catch (error) {
                    setError('Failed to load user groups. Please try again later.');
                    console.error('Failed to load user groups:', error);
                }
            };

            loadUserGroups();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (isAuthenticated && user?.sub) {
            const checkJoinRequestStatusForGroups = async () => {
                const statusMap = {};
                for (const group of allGroups) {
                    try {
                        const status = await checkJoinRequestStatus(group.group_id, user.sub);
                        statusMap[group.group_id] = status;
                    } catch (error) {
                        setError('Failed to check join request status. Please try again later.');
                        console.error('Error fetching join request status:', error);
                    }
                }
                setJoinRequestStatus(statusMap);
            };

            checkJoinRequestStatusForGroups();
        }
    }, [allGroups, isAuthenticated, user]);

    const handleCreateGroupClick = () => {
        if (!isAuthenticated) {
            loginWithRedirect();
            return;
        }
        setCreateGroupOpen(true);
    };

    const handleCreateGroupSubmit = async (e) => {
        e.preventDefault();
        if (!newGroupName || !newGroupDescription) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const newGroup = {
                group_name: newGroupName,
                description: newGroupDescription,
                admin: user.sub,
            };

            const createdGroup = await createGroup(newGroup);

            setMyGroups((prev) => [...prev, createdGroup]);
            setAllGroups((prev) => [...prev, createdGroup]);

            const groupId = createdGroup.group_id;
            const status = await checkJoinRequestStatus(groupId, user.sub);
            setJoinRequestStatus((prevStatus) => ({
                ...prevStatus,
                [groupId]: status,
            }));

            setCreateGroupOpen(false);
            setNewGroupName('');
            setNewGroupDescription('');
            setError('');
        } catch (error) {
            setError('Failed to create group. Please try again later.');
            console.error('Error creating group:', error);
        }
    };

    const handleJoinGroupClick = async (group_id) => {
        if (!isAuthenticated) {
            loginWithRedirect();
            return;
        }
        try {
            await sendJoinRequest(group_id, user.sub);

            setJoinRequestStatus((prevStatus) => ({
                ...prevStatus,
                [group_id]: 'pending',
            }));
        } catch (error) {
            setError('Failed to send join request. Please try again later.');
            console.error('Error sending join request:', error);
        }
    };

    const isUserInGroup = (group_id) => {
        return myGroups.some((group) => group.group_id === group_id);
    };

    const myOwnGroups = myGroups.filter((group) => group.is_admin === true);
    const memberGroups = myGroups.filter((group) => group.is_admin === false);

    const filteredGroups = allGroups.filter((group) =>
        group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteGroupClick = (group_id) => {
        setDeleteGroupId(group_id); 
        setDeleteModalOpen(true); 
    };

    const handleDeleteGroup = async () => {
        if (!deleteGroupId) return;

        try {
            await deleteGroup(deleteGroupId, user.sub); 
            setMyGroups((prev) => prev.filter((group) => group.group_id !== deleteGroupId));
            setAllGroups((prev) => prev.filter((group) => group.group_id !== deleteGroupId));

            setNotifications((prevNotifications) => [
                ...prevNotifications,
                { type: 'warning', message: 'Group deleted successfully.' }
            ]);
        } catch (error) {
            setError('Failed to delete group. Please try again later.');
            console.error('Failed to delete group:', error);

            setNotifications((prevNotifications) => [
                ...prevNotifications,
                { type: 'error', message: 'Failed to delete group. Please try again later.' }
            ]);
        } finally {
            setDeleteModalOpen(false); 
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false); 
    };

    return (
        <div className="groups-container">
            <Navbar />
            <div className="groups-content">
                <div className="groups-left-section">
                    <h2>All Groups</h2>
                    <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="groups-search-input"
                    />
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ul>
                            {filteredGroups.map((group, index) => (
                                <li
                                    key={group.group_id || index}
                                    className="groupspage-item"
                                    title={!isAuthenticated ? 'To join, you have to login' : ''}
                                >
                                    <h3>{group.group_name}</h3>
                                    <p>{group.description}</p>
                                    {isAuthenticated ? (
                                        <>
                                            {joinRequestStatus[group.group_id] === 'not-a-member' &&
                                                !isUserInGroup(group.group_id) && (
                                                    <button onClick={() => handleJoinGroupClick(group.group_id)}>
                                                        Join this Group
                                                    </button>
                                                )}
                                            {joinRequestStatus[group.group_id] === 'pending' && (
                                                <button disabled>Your Joining Request is Pending</button>
                                            )}
                                            {joinRequestStatus[group.group_id] === 'rejected' && (
                                                <button disabled>Your Joining Request is Rejected</button>
                                            )}
                                        </>
                                    ) : (
                                        <p className="groups-hover-message">Hover to see join info</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="groups-right-section">
                    <h2>My Groups</h2>
                    <h3>My Own Groups</h3>
                    {myOwnGroups.length === 0 ? (
                        <p>You have not created any groups yet.</p>
                    ) : (
                        <ul className="groups-list">
                            {myOwnGroups.map((group, index) => (
                                <li className="group-item" key={group.group_id || index}>
                                    <div className="group-content">
                                        <Link to={`/group/${group.group_id}`} className="group-link">
                                            <h3>{group.group_name}</h3>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteGroupClick(group.group_id)}
                                            className="delete-group-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
    
                    <h3>My Member Groups</h3>
                    {memberGroups.length === 0 ? (
                        <p>You have not joined any groups yet.</p>
                    ) : (
                        <ul className="groups-list">
                            {memberGroups.map((group, index) => (
                                <li className="group-item" key={group.group_id || index}>
                                    <Link to={`/group/${group.group_id}`} className="group-link">
                                        <h3>{group.group_name}</h3>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
    
                    <button onClick={handleCreateGroupClick} className="create-group-button">
                        Create a New Group
                    </button>
                </div>
            </div>
    
            {isDeleteModalOpen && (
                <div className="delete-modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to delete this group?</h3>
                        <button onClick={handleDeleteGroup} className="confirm-delete-button">Yes, Delete</button>
                        <button onClick={handleCancelDelete} className="cancel-delete-button">Cancel</button>
                    </div>
                </div>
            )}
    
            <Footer />
        </div>
    );   
}

export default GroupsPage;
