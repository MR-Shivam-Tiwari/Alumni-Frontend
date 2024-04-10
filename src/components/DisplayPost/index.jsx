import './displayPost.css';
import NoGroups from '../Groups/NoGroups';
import picture from '../../images/d-group.jpg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { lineSpinner } from 'ldrs';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

lineSpinner.register();

const DisplayPost = ({ title, groups = [], loading, joined }) => {
  const profile = useSelector((state) => state.profile);
  const [notificationList, setNotificationList] = useState([]);
  const navigateTo = useNavigate();

  const admin = profile.profileLevel === 0;

  const getRequest = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/groups/requests/req`);
      setNotificationList(response.data);
    } catch (error) {
      console.error("Error fetching request:", error);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  const GroupItem = ({ group }) => {
    const [requestStatus, setRequestStatus] = useState('Request to Join');

    useEffect(() => {
      const matchingNotification = notificationList.find(
        (notification) => notification.groupId === group._id && notification.userId === profile._id
      );

      if (matchingNotification) {
        setRequestStatus('Requested');
      } else {
        setRequestStatus('Request to Join');
      }
    }, [group._id, notificationList, profile._id]);

    const handleRequest = async (ownerId, groupId, userId, groupName, firstName,lastName) => {
      const requestedUserName = `${firstName} ${lastName}`
      const body = {
        ownerId,
        groupId,
        userId,
        groupName,
        requestedUserName
      };
      setRequestStatus('Loading...');
      try {
        const response = await axios.post(`http://localhost:5000/groups/createRequest`, body);
        console.log('body', response.data);
        if (response.data.requested === true) setRequestStatus('Requested');
        else setRequestStatus('Request');
      } catch (error) {
        console.error("Error creating request:", error);
      }
    };

    const handleAddMember = async (groupId) => {
      console.log('adding member',groupId)
      //setLoading(true)
      try {
        const response = await axios.put(`http://localhost:5000/groups/members/${groupId}`, {
          userId: profile._id,
        });
  
        if (response.status === 200) {
          const { isUserAdded } = response.data;
          if (isUserAdded === true) {
            //setIsAdded(true);
            //setLoading(false);
            toast.success('added')
            navigateTo(`/groups/${groupId}`)
          }
          if (isUserAdded === false) {
            toast.success('removed')
          }
  
          console.log('User added/removed to/from the group:', isUserAdded);
        } else {
  
          console.error('Failed to add/remove user to/from the group');
        }
      } catch (error) {
  
        console.error('Error adding/removing user to/from the group:', error);
      }
    };

    return (
      <div key={group._id} className='display-post-card'>
        {profile.profileLevel===0 || group.groupType === 'Public' || (group.groupType === 'Private' && group.members.includes(profile._id)) ? (
          <Link to={`/groups/${group._id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <div className='display-post-image' style={{position: 'relative'}}>
              <img src={picture} alt="" width="100px" height="100px" style={{position: 'absolute'}}/>
              <p style={{position: 'absolute', top: '10px', right: '20px', backgroundColor: 'lightsteelblue', padding: '0px 15px', border: '1px solid'}}>{group.groupType}</p>
            </div>
            <div className='display-post-title'>
              <p style={{ marginBottom: '0rem', fontWeight: '600', fontSize: '1em' }}>{group.groupName}</p>
              <p style={{ marginBottom: '0rem', color: '#7b7b7b' }}>{group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}</p>
            </div>
          </Link>
        ) : (
          <>
            <div className='display-post-image' style={{position: 'relative'}}>
              <img src={picture} alt="" width="100px" height="100px" style={{position: 'absolute'}}/>
              <p style={{position: 'absolute', top: '10px', right: '20px', backgroundColor: 'lightsteelblue', padding: '0px 15px', border: '1px solid'}}>{group.groupType}</p>
            </div>
            <div className='display-post-title'>
              <p style={{ marginBottom: '0rem', fontWeight: '600', fontSize: '1em', color: '#7b7b7b' }}>{group.groupName}</p>
              <p style={{ marginBottom: '0rem', color: '#7b7b7b' }}>{group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}</p>
            </div>
          </>
        )}
        {(group.groupType === 'Public' || group.groupType === 'Private') && !group.members.includes(profile._id) && (
          <div className='display-post-edit'>
            {group.groupType === 'Public' ? (
              <button onClick={() => handleAddMember(group._id)}>Join</button>
            ) : profile.department === group.department && (
              <button onClick={() => handleRequest(group.userId, group._id, profile._id, group.groupName, profile.firstName,profile.lastName)}>{requestStatus}</button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Filter groups to include only Public or Private groups matching user's department
  let filteredGroups;
  if (profile.department === 'All') {
    filteredGroups = groups;
  } else {
    filteredGroups = groups.filter(group => group.groupType === 'Public' || (group.groupType === 'Private' && profile.department === group.department));
  }

  return (
    <div className="display-post-container">
      {loading ? (
        <div style={{ display: 'flex', width: '100%', height: '40vh', alignItems: 'center', justifyContent: 'center' }}>
          <l-line-spinner
            size="40"
            stroke="3"
            speed="1"
            color="black"
          ></l-line-spinner>
        </div>
      ) : filteredGroups.length > 0 ? (
        filteredGroups.map((group) => <GroupItem key={group._id} group={group} />)
      ) : (
        <div className='display-post-noGroups'>No groups</div>
      )}
    </div>
  );
};

export default DisplayPost;
