import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchGroupById } from '../utils/api';
import '../styles/GroupPage.css';

function GroupPage() {
    const { group_id } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadGroupDetails = async () => {
            setLoading(true);
            try {
                const groupData = await fetchGroupById(group_id);
                setGroupDetails(groupData);
            } catch (error) {
                setError('Failed to load group details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (group_id) {
            loadGroupDetails();
        }
    }, [group_id]);

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
                                    {groupDetails.members.map((member) => (
                                        <li key={member.user_id} className={member.is_admin ? 'admin' : 'member'}>
                                            {member.user_id} {member.is_admin && '(Admin)'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </div>
                <div className="group-right-section">
                    <h2>Additional Options</h2>
                    <p>Here you can add options like joining the group, messaging, etc.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default GroupPage;
