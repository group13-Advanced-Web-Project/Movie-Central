import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchGroupInfo, fetchGroupMembers, fetchPendingRequests, respondToRequest } from '../utils/api';
import '../styles/GroupPage.css';

function GroupPage() {
    const { group_id } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadGroupDetails = async () => {
            setLoading(true);
            try {
                // Fetch group information
                const groupData = await fetchGroupInfo(group_id);
                if (groupData && groupData.length > 0) {
                    const group = groupData[0]; // Group details (first element)
                    setGroupDetails(group); // Set group details (name, description)
                } else {
                    setError('Group not found.');
                }
            } catch (error) {
                setError('Failed to load group details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const loadGroupMembers = async () => {
            try {
                const membersData = await fetchGroupMembers(group_id); // Fetch group members separately
                
                // Filter out pending members
                const acceptedMembers = membersData.filter((member) => member.status === 'accepted');
                
                // Split admins and members, only for accepted members
                const admins = acceptedMembers.filter((member) => member.is_admin);
                const members = acceptedMembers.filter((member) => !member.is_admin);

                // Combine admins first, then members
                setGroupMembers([...admins, ...members]);
            } catch (error) {
                console.error('Failed to fetch group members:', error);
                setError('Failed to load group members. Please try again later.');
            }
        };

        const loadPendingRequests = async () => {
            try {
                const requests = await fetchPendingRequests(group_id);
                setPendingRequests(requests);
            } catch (error) {
                console.error('Failed to fetch pending requests:', error);
            }
        };

        if (group_id) {
            loadGroupDetails();
            loadGroupMembers();
            loadPendingRequests();
        }
    }, [group_id]);

    const handleRequestResponse = async (user_id, action) => {
        try {
            const response = await respondToRequest(group_id, user_id, action);
            if (response.message) {
                // Remove the accepted request from the pending requests list
                setPendingRequests((prevRequests) =>
                    prevRequests.filter((request) => request.user_id !== user_id)
                );
    
                if (action === 'accepted') {
                    // Fetch updated group members
                    const updatedMembers = await fetchGroupMembers(group_id);
    
                    // Filter and sort the members: show only accepted members
                    const acceptedMembers = updatedMembers.filter((member) => member.status === 'accepted');
                    const admins = acceptedMembers.filter((member) => member.is_admin);
                    const members = acceptedMembers.filter((member) => !member.is_admin);
    
                    // Combine admins first, then members
                    setGroupMembers([...admins, ...members]);
                }
            }
        } catch (error) {
            setError('Failed to update request status.');
        }
    };
    

    return (
        <div className="group-page-container">
            <Navbar />
            <div className="group-page-content">
                <div className="group-left-section">
                    {loading ? (
                        <p>Loading group details...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        groupDetails && (
                            <div>
                                <h1 className="group-name">{groupDetails.group_name}</h1>
                                <p className="group-description">{groupDetails.description}</p>

                                <h2>Group Members</h2>
                                <ul className="group-members">
                                    {groupMembers.map((member) => (
                                        <li key={member.user_id} className={member.is_admin ? 'admin' : 'member'}>
                                            {member.nickname} {member.is_admin && '(Admin)'}
                                        </li>
                                    ))}
                                </ul>

                                <h2>Pending Join Requests</h2>
                                {pendingRequests.length > 0 ? (
                                    <ul className="pending-requests">
                                        {pendingRequests.map((request) => (
                                            <li key={request.user_id}>
                                                {request.nickname}
                                                <button
                                                    onClick={() => handleRequestResponse(request.user_id, 'accepted')}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRequestResponse(request.user_id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No pending requests.</p>
                                )}
                            </div>
                        )
                    )}
                </div>
                <div className="group-right-section">
                    <h2>Additional Options</h2>
                    <p>This place for add Customising group page contents like information about a movie
                    (ID 5) or a showtime (ID 6).</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default GroupPage;
