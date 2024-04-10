import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './members.css';
import Profilecard from '../../components/Profilecard';
import PageSubTitle from '../../components/PageSubTitle';
import { Route, Routes } from "react-router-dom";
import DonSponRequest from '../../components/DonSponRequest';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";
const Members = ({ addButton, groupMembers, owner, deleteButton }) => {
  const membersred = useSelector((state) => state.member.filter(member => member.profileLevel !== 0));
  const [cookie,setCookie] = useCookies('token')
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noUsersFound, setNoUsersFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const activePageRef = useRef(1);
  const LIMIT = 6;
  const profile = useSelector((state) => state.profile);
  let admin;
  if (profile.profileLevel === 0 || profile.profileLevel === 1) {
    admin = true;
  }
  console.log('profile level', profile.profileLevel)

  const totalMembers = membersred.length;

  // useEffect(() => {
  //   console.log('useEffect1')
  //   if (membersred.length > 0) {
  //     console.log('members red2')
  //     const initialBatch = membersred.slice(0, LIMIT);
  //     setDisplayedMembers(initialBatch);

  //   }
  // }, []);

  useEffect(() => {
    console.log('useEffect2')
    initialMembers();
  }, []);

  useEffect(() => {
    console.log('useEffect3')
    if (searchQuery) {
      const filteredMembers = membersred.filter(
        (member) =>
          member.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedMembers(filteredMembers.slice(0, LIMIT));
      setNoUsersFound(filteredMembers.length === 0);
    } else {
      const initialBatch = membersred.slice(0, LIMIT);
      setDisplayedMembers(initialBatch);
      setNoUsersFound(false);
    }
  }, [searchQuery]);

  const loadMoreMembers = () => {
    setLoading(true);
    const startIndex = activePageRef.current * LIMIT;
    const endIndex = startIndex + LIMIT;
    const nextBatch = membersred.slice(startIndex, endIndex);
    setDisplayedMembers((prevMembers) => [...prevMembers, ...nextBatch]);
    activePageRef.current++;
    setLoading(false);
  };

  const initialMembers = () => {
    setLoading(true);
    const startIndex = activePageRef.current * LIMIT;
    const endIndex = startIndex + LIMIT;
    const nextBatch = membersred.slice(startIndex, endIndex);
    setDisplayedMembers((prevMembers) => [...prevMembers, ...nextBatch]);
    setLoading(false);
  };

  const handleDelete = async (memberId) => {
    console.log('handling delete')
    try {
      const token = cookie.token; 
      const response = await axios.delete(`http://localhost:5000/alumni/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        // Remove the deleted member from displayedMembers
        //setDisplayedMembers(displayedMembers.filter(member => member._id !== memberId));
        console.log('User deleted successfully');
        toast.success("Alumni Deleted");
        window.location.reload();
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  

  return (
    <div className="member-container">
      <div
        style={{
          backgroundColor: '#174873',
          paddingBottom: '2em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '17vh',
        }}
      >
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Routes>
        <Route path="/" element={

          <>
            <div>
              <PageSubTitle
                buttontext1={`All Members (${profile.profileLevel === 0 ? 'superadmin' : profile.profileLevel === 1 ? 'admin' : 'alumni/current'})`}
                name='members'
                create={admin}
              />

            </div>
            <div
              className="pro"
              style={{
                marginTop: '1em',
                display: 'flex',
                flexWrap: 'wrap',
                paddingBottom: '20px',
              }}
            >
              {displayedMembers.map((member) => (
                <Profilecard
                  key={member._id}
                  member={member}
                  addButton={addButton}
                  groupMembers={groupMembers}
                  owner={owner}
                  deleteButton={deleteButton !== undefined ? deleteButton : true}
                  handleDelete={() => handleDelete(member._id)}
                />
              ))}
            </div>
            {loading && <div style={{ textAlign: 'center' }}> Loading...</div>}
            {console.log('act', activePageRef.current, LIMIT, totalMembers)}
            {activePageRef.current * LIMIT < totalMembers && (
              <div style={{ textAlign: 'center' }}>
                <button className="load-more-button" onClick={loadMoreMembers}>
                  Load More
                </button>
              </div>
            )}
          </>

        } />
        <Route path="/create" element={<DonSponRequest name='member' />} />
      </Routes>

    </div>
  );
};

export default Members;
