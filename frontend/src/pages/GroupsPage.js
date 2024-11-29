import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createGroup, fetchAllGroups, fetchUserGroups } from '../utils/api';
import { Link } from 'react-router-dom'; 
import '../styles/Groups.css';

function GroupsPage() {
    const [allGroups, setAllGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    

    const { user, isAuthenticated, loginWithRedirect } = useAuth0();

    useEffect(() => {
        const loadAllGroups = async () => {
            setLoading(true);
            try {
                const allGroupsData = await fetchAllGroups(); 
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
            await createGroup(newGroup);

            setMyGroups((prev) => [...prev, newGroup]);
            setAllGroups((prev) => [...prev, newGroup]);
            setCreateGroupOpen(false);
            setNewGroupName('');
            setNewGroupDescription('');
            setError('');
        } catch (error) {
            console.error('Error creating group:', error);
            setError('Failed to create group. Please try again.');
        }
    };

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
                            {allGroups.map((group) => (
                                <li key={group.id}>
                                    <h3>{group.group_name}</h3>
                                    <p>{group.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="groups-right-section">
                    <h2>My Groups</h2>
                    {myGroups.length === 0 ? (
                        <p>You have not joined or created any groups yet.</p>
                    ) : (
                        <ul>
                            {myGroups.map((group) => (
                                <li className="groups-li" key={group.id}>
                                    <Link to={`/group/${group.group_id}`}>
                                        <h3>{group.group_name}</h3>
                                    </Link>
                                    <p>{group.description}</p>
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
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setCreateGroupOpen(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default GroupsPage;
