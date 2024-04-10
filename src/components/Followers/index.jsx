import React, { useState, useEffect, useRef } from 'react';
import { HiUsers } from "react-icons/hi2";
import PageTitle from '../PageTitle';
import Profilecard from '../Profilecard';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const Followers = () => {
  const title = 'Followers';
  const icon = <HiUsers style={{ color: '#174873' }} />;
  const [members, setMembers] = useState([]);
  const [cookie, setCookie] = useCookies(['access_token']);
  const profile = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const LIMIT = 6;
  const [totalFollowers, setTotalFollowers] = useState(0);
  const activePage = useRef(1);
  const { id } = useParams();

  const fetchMembers = async (page) => {
    try {
      console.log('page', page);
      const response = await fetch(`http://localhost:5000/alumni/${id}/followers?page=${page}&size=${LIMIT}`);
      if (response.ok) {
        const data = await response.json();
        setTotalFollowers(data.totalFollowers);
        setMembers((prevMembers) => [...prevMembers, ...data.followerDetails]);
      } else {
        console.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching members
    }
  };

  useEffect(() => {
    fetchMembers(activePage.current);
  }, []);

  console.log('membersss', members);

  const updateFollowers = () => {
    console.log('Update Followers');
    activePage.current++;
    fetchMembers(activePage.current);
  };

  return (
    <div style={{ width: '60%', marginTop: '20px' }}>
      <PageTitle title={title} icon={icon} />
      {loading ? ( // Conditionally render loading message
        <div style={{ textAlign: 'center' }}> Loading...</div>
      ) : members!== undefined && members.length > 0 ? (
        <>
          <div style={{ marginTop: '15px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            {members.map((member) => (
              <Profilecard key={member._id} member={member} name='follow' />
            ))}
          </div>
          {activePage.current < totalFollowers / LIMIT && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className="load-more-button" onClick={updateFollowers}>
                Load More
              </button>
            </div>
          )}
        </>
      ): (
        <div style={{textAlign: 'center'}}>No Followers</div>
      )}
    </div>
  );
};
