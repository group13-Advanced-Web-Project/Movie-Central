import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchGroupInfo, fetchGroupMembers, fetchPendingRequests, respondToRequest, removeMember, searchMovies } from '../utils/api';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/GroupPage.css';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_API_URL;

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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [groupMovies, setGroupMovies] = useState([]);
    const dropdownRef = useRef(null);


    const loadGroupMovies = async () => {
        try {
            const response = await axios.get(`${serverUrl}/groups/${group_id}/movies`);
            setGroupMovies(response.data || []);
        } catch (error) {
            console.error('Failed to fetch group movies:', error);
            setError('Failed to fetch movies for the group.');
        }
    };

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

                const loggedInMember = acceptedMembers.find((member) => member.user_id === user?.sub);
                setIsAdmin(loggedInMember?.is_admin || false);
                setGroupMembers([...admins, ...members]);
            } catch (error) {
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
            loadGroupMovies();
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

            const updatedMembers = await fetchGroupMembers(group_id);
            const acceptedMembers = updatedMembers.filter((member) => member.status === 'accepted');
            const admins = acceptedMembers.filter((member) => member.is_admin);
            const members = acceptedMembers.filter((member) => !member.is_admin);

            setGroupMembers([...admins, ...members]);

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

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length >= 1) {
            try {
                const results = await searchMovies(query);
                setSearchResults(results);
            } catch (error) {
                console.error('Failed to fetch search results:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectMovie = async (movie) => {
        try {
            const response = await axios.post(`${serverUrl}/groups/${group_id}/movies`, {
                movie_id: movie.id,
            });
            await loadGroupMovies();            
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to add movie to group.');
        } finally {
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    const handleClickOutside = (event) => {
        console.log("Click detected outside:", event.target);
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setSearchResults([]);
        }
    };
    

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                                                            className="accept-button"
                                                            onClick={() => handleRequestResponse(request.user_id, 'accepted')}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            className="reject-button"
                                                            onClick={() => handleRequestResponse(request.user_id, 'rejected')}
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
                    <div className="movie-information">
                        <h2>Movie Information</h2>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search for a movie..."
                            className="group-search-bar"
                        />

                        {searchResults.length > 0 && (
                            <div ref={dropdownRef} className="group-dropdown">
                                <ul>
                                    {searchResults.map((movie) => (
                                        <li key={movie.id} onClick={() => handleSelectMovie(movie)}>
                                            {movie.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>                        
                        )}
                    </div>

                    <div className="group-movies">
                        <h2>Movies in Group</h2>
                        {groupMovies.length > 0 ? (
                            <div className="group-movie-list">
                                {groupMovies.map((movie) => (
                                    <div className="movie-item" key={movie.movie_id}>
                                        <img
                                            src={movie.poster_path || '/assets/sample_image.jpg'}
                                            alt={movie.movie_name}
                                            className="movie-poster"
                                        />
                                        <div className="movie-info">
                                            <h3 className="movie-name">{movie.movie_name}</h3>
                                            <p className="movie-overview">{movie.movie_overview}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No movies in the group yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {showRemoveModal && (
                <div className="remove-member-modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to remove {selectedMember?.nickname}?</h3>
                        <button onClick={handleRemoveMember}>Yes, Remove</button>
                        <button onClick={closeRemoveModal}>Cancel</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default GroupPage;
