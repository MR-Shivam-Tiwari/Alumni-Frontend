import React, { useState, useEffect } from 'react';
import PageTitle from '../../PageTitle';
import { BsGlobe } from 'react-icons/bs';
import Members from '../../../pages/Members';
import { useParams } from 'react-router-dom';

export const AddMembers = ({type}) => {
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState('');
  const icon = <BsGlobe style={{ color: '#87dbf2' }} />
  const { _id,id } = useParams();
  console.log("add members",id)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/groups/${_id}/members`);
        const data = await response.json();
        if (response.ok) {
          setMembers(data.members);
          setOwner(data.owner)
        } else {
          console.error('Failed to fetch members:', data.message || response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };
    const fetchForumMembers = async () => {
      console.log('Fetching forum members')
      try {
        const response = await fetch(`http://localhost:5000/forums/${id}/members`);
        const data = await response.json();
        if (response.ok) {
          setMembers(data.members);
          setOwner(data.owner)
        } else {
          console.error('Failed to fetch members:', data.message || response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };
    if (type === 'groups') fetchMembers();
    else if(type === 'forums') fetchForumMembers();
    else console.log('not a group or forum');
  }, []);
  console.log('membe', members)

  return (
    <div>
      <PageTitle title="Add/Remove members" style={{ marginTop: '0px' }} icon={icon} />
      <Members addButton={true} groupMembers={members} owner={owner} deleteButton={false}/>
    </div>
  )
}
