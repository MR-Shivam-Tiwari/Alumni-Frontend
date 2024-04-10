import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { lineSpinner } from 'ldrs'

lineSpinner.register()



export const JoinGroup = () => {
  const profile = useSelector((state) => state.profile);
  const navigateTo = useNavigate();
  const { _id } = useParams();
  const [groupMembersId, setGroupMembersId] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAllGroupMembers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/groups/${_id}/members`);
      if (response.status === 200) {
        setGroupMembersId(response.data.members);
      }
    } catch (error) {
      console.log('Error fetching group members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllGroupMembers();
  }, []);

  useEffect(() => {
    setIsMember(groupMembersId.includes(profile._id));
  }, [groupMembersId, profile._id]);

  const handleAddMember = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/groups/members/${_id}`, {
        userId: profile._id,
      });

      if (response.status === 200) {
        const { isUserAdded } = response.data;
        if (isUserAdded === true) {
          toast.success('Joined successfully!');
          navigateTo(`/groups/${_id}`);
        } else {
          toast.error('Join failed');
        }
      } else {
        console.error('Failed to add/remove user from the group');
      }
    } catch (error) {
      console.error('Error adding/removing user from the group:', error);
    }
  };

  const handleCancel = () => {
    navigateTo('/groups');
  };

  return (
    <div style={{ width: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3vw' }}>
      {isLoading ? (

        <l-line-spinner
          size="40"
          stroke="3"
          speed="1"
          color="black"
        ></l-line-spinner>
      ) : (
        <>
          {isMember ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <p>You are already a member of the group</p>
                <Link to={`/groups/${_id}`}> View Group </Link>
              </div>
            </>
          ) : (
            <>
              <button style={{ color: '#ffffff', backgroundColor: '#174873', border: 'none', padding: '10px', borderRadius: '10px' }} onClick={handleAddMember}>Join Group</button>
              <button style={{ color: '#ffffff', backgroundColor: '#174873', border: 'none', padding: '10px', borderRadius: '10px' }} onClick={handleCancel}>Cancel</button>
            </>
          )}
        </>
      )}
    </div>
  );
};
