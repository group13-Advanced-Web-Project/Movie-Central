import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createGroup, fetchAllGroups, fetchUserGroups, sendJoinRequest, checkJoinRequestStatus } from '../utils/api';
import { Link } from 'react-router-dom';
import '../styles/Groups.css';

function GroupsPage() {
    const [allGroups, setAllGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [joinRequestStatus, setJoinRequestStatus] = useState({}); // Store join request status for each group
    const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [joinRequestMessage, setJoinRequestMessage] = useState(''); // New state for the join request message

    const { user, isAuthenticated, loginWithRedirect } = useAuth0();

    useEffect(() => {
        const loadAllGroups = async () => {
            setLoading(true);
            try {
                const allGroupsData = await fetchAllGroups();
                console.log('Fetched All Groups:', allGroupsData); // Debug log
                setAllGroups(allGroupsData);
            } catch (error) {
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
                    console.error('Failed to load user groups:', error);
                }
            };

            loadUserGroups();
        }
    }, [isAuthenticated, user]);

    // New useEffect to check the join request status for each group
    useEffect(() => {
        if (isAuthenticated && user?.sub) {
            const checkJoinRequestStatusForGroups = async () => {
                const statusMap = {};
                for (const group of allGroups) {
                    try {
                        const status = await checkJoinRequestStatus(group.group_id, user.sub); // Using the API helper
                        statusMap[group.group_id] = status;
                    } catch (error) {
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

            // Create group and expect the group_id in the response
            const createdGroup = await createGroup(newGroup);

            // Add the new group to the state using the group_id
            setMyGroups((prev) => [...prev, createdGroup]);
            setAllGroups((prev) => [...prev, createdGroup]);

            // Check the status of the new group after creation
            const groupId = createdGroup.group_id;

            // Check the join request status immediately after creating the group
            const status = await checkJoinRequestStatus(groupId, user.sub);
            setJoinRequestStatus((prevStatus) => ({
                ...prevStatus,
                [groupId]: status,
            }));

            // Close the create group form and reset fields
            setCreateGroupOpen(false);
            setNewGroupName('');
            setNewGroupDescription('');
            setError('');
        } catch (error) {
            console.error('Error creating group:', error);
            setError('Failed to create group. Please try again.');
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
            console.error('Error sending join request:', error);
            alert('Failed to send join request.');
        }
    };    

    const isUserInGroup = (group_id) => {
        return myGroups.some(group => group.group_id === group_id); 
    };

    const myOwnGroups = myGroups.filter(group => group.is_admin === true); 
    const memberGroups = myGroups.filter(group => group.is_admin === false); 

    return (
        <div className="groups-container">
            <Navbar />
            <div className="groups-content">
                <div className="groups-left-section">
                    <h2>All Groups</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ul>
                            {allGroups.map((group, index) => (
                                <li
                                    key={group.group_id || index}
                                    className="groupspage-item"
                                    title={!isAuthenticated ? "To join, you have to login" : ""}
                                >
                                    <h3>{group.group_name}</h3>
                                    <p>{group.description}</p>

                                    {/* Show buttons or status based on the user's join request */}
                                    {isAuthenticated ? (
                                        <>
                                            {joinRequestStatus[group.group_id] === 'not-a-member' && !isUserInGroup(group.group_id) && (
                                                <button onClick={() => handleJoinGroupClick(group.group_id)}>
                                                    Join this Group
                                                </button>
                                            )}
                                            {joinRequestStatus[group.group_id] === 'pending' && (
                                                <button disabled>
                                                    Your Joining Request is Pending
                                                </button>
                                            )}
                                            {joinRequestStatus[group.group_id] === 'rejected' && (
                                                <button disabled>
                                                    Your Joining Request is Rejected
                                                </button>
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
                    {/* My Own Groups */}
                    <h3>My Own Groups</h3>
                    {myOwnGroups.length === 0 ? (
                        <p>You have not created any groups yet.</p>
                    ) : (
                        <ul>
                            {myOwnGroups.map((group, index) => (
                                <li className="groups-li" key={group.group_id || index}>
                                    <Link to={`/group/${group.group_id}`}>
                                        <h3>{group.group_name}</h3>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    {/* Member Groups */}
                    <h3>Member Groups</h3>
                    {memberGroups.length === 0 ? (
                        <p>You are not a member of any groups yet.</p>
                    ) : (
                        <ul>
                            {memberGroups.map((group, index) => (
                                <li className="groups-li" key={group.group_id || index}>
                                    <Link to={`/group/${group.group_id}`}>
                                        <h3>{group.group_name}</h3>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    <button onClick={handleCreateGroupClick} className="create-group-button">
                        Create Group
                    </button>
                </div>
            </div>

            {isCreateGroupOpen && (
                <div className="create-group-popup">
                    <form onSubmit={handleCreateGroupSubmit}>
                        <h3>Create a New Group</h3>
                        {error && <p className="error-message">{error}</p>}
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <textarea
                            placeholder="Group Description"
                            value={newGroupDescription}
                            onChange={(e) => setNewGroupDescription(e.target.value)}
                        />
                        <button type="submit">Create</button>
                        <button type="button" onClick={() => setCreateGroupOpen(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
            {/* Displaying the join request message */}
            {joinRequestMessage && <p className="join-request-message">{joinRequestMessage}</p>}
            <Footer />
        </div>
    );
}

export default GroupsPage;
