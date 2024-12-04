import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    fetchGroupInfo,
    fetchGroupMembers,
    fetchPendingRequests,
    respondToRequest,
    removeMember
} from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/GroupPage.css';

function GroupPage() {
    const { group_id } = useParams();
    const { user } = useAuth0();
    const [groupDetails, setGroupDetails] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const loadGroupDetails = async () => {
            setLoading(true);
            try {
                const groupData = await fetchGroupInfo(group_id);
                if (groupData && groupData.length > 0) {
                    const group = groupData[0];
                    setGroupDetails(group);
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
                const membersData = await fetchGroupMembers(group_id);
                const acceptedMembers = membersData.filter((member) => member.status === 'accepted');
                const admins = acceptedMembers.filter((member) => member.is_admin);
                const members = acceptedMembers.filter((member) => !member.is_admin);

                // Check if the logged-in user is an admin
                const loggedInMember = acceptedMembers.find((member) => member.user_id === user?.sub);
                setIsAdmin(loggedInMember?.is_admin || false);

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
    }, [group_id, user?.sub, refresh]);

    const handleRequestResponse = async (user_id, action) => {
        try {
            const response = await respondToRequest(group_id, user_id, action);
            if (response.message) {
                setPendingRequests((prevRequests) =>
                    prevRequests.filter((request) => request.user_id !== user_id)
                );
                if (action === 'accepted') {
                    const updatedMembers = await fetchGroupMembers(group_id);
                    const acceptedMembers = updatedMembers.filter((member) => member.status === 'accepted');
                    const admins = acceptedMembers.filter((member) => member.is_admin);
                    const members = acceptedMembers.filter((member) => !member.is_admin);
                    setGroupMembers([...admins, ...members]);
                }
            }
        } catch (error) {
            setError('Failed to update request status.');
        }
    };

    const handleRemoveMember = async () => {
        if (!selectedMember) return;

        try {
            const result = await removeMember(group_id, selectedMember.user_id);
            console.log('Member removed:', result);

            // Refetch group members to reflect the updated list
            const updatedMembers = await fetchGroupMembers(group_id);
            const acceptedMembers = updatedMembers.filter((member) => member.status === 'accepted');
            const admins = acceptedMembers.filter((member) => member.is_admin);
            const members = acceptedMembers.filter((member) => !member.is_admin);

            setGroupMembers([...admins, ...members]);

            // Trigger re-fetch by updating refresh state
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Failed to remove member:', error);
            setError('Failed to remove member. Please try again.');
        }

        setShowRemoveModal(false);
        setSelectedMember(null);
    };

    const openRemoveModal = (member) => {
        setSelectedMember(member);
        setShowRemoveModal(true);
    };

    const closeRemoveModal = () => {
        setShowRemoveModal(false);
        setSelectedMember(null);
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
                                            {user && (
                                                (isAdmin || member.user_id === user.sub) && (
                                                    <button
                                                        onClick={() => openRemoveModal(member)}
                                                        className="remove-member-button"
                                                    >
                                                        {isAdmin && member.user_id !== user.sub
                                                            ? 'Remove Member'
                                                            : 'Leave Group'}
                                                    </button>
                                                )
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <h2>Pending Join Requests</h2>
                                {pendingRequests.length > 0 ? (
                                    <ul className="pending-requests">
                                        {pendingRequests.map((request) => (
                                            <li key={request.user_id} className="request-item">
                                                <span>{request.nickname}</span>
                                                {isAdmin && (
                                                    <div className="button-container">
                                                        <button
                                                            onClick={() => handleRequestResponse(request.user_id, 'accepted')}
                                                            className="accept-button"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestResponse(request.user_id, 'rejected')}
                                                            className="deny-button"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
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
                    <p>
                        This place for adding Customizing group page contents like information about a movie (ID 5) or a
                        showtime (ID 6).
                    </p>
                </div>
            </div>
            <Footer />

            {/* Modal for confirming member removal */}
            {showRemoveModal && (
                <div className="remove-member-modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to remove {selectedMember?.nickname}?</h3>
                        <button onClick={handleRemoveMember} className="confirm-remove-button">
                            Yes, Remove
                        </button>
                        <button onClick={closeRemoveModal} className="cancel-remove-button">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GroupPage;
