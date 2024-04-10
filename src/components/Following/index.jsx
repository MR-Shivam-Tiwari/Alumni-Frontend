import React, { useState, useEffect, useRef } from 'react';
import { HiMiniUserPlus } from "react-icons/hi2";
import PageTitle from '../PageTitle';
import Profilecard from '../Profilecard';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const Following = () => {
  const title = 'Following';
  const icon = <HiMiniUserPlus style={{ color: '#174873' }} />;
  const [members, setMembers] = useState([]);
  const [cookie, setCookie] = useCookies(['access_token']);
  const { id } = useParams();
  const [loading, setLoading]= useState(true);
  const LIMIT = 6;
  const [totalFollowing, setTotalFollowing] = useState(0);
  const activePage = useRef(1);
  const profile = useSelector((state)=> state.profile);
  const member = useSelector((state)=> state.member);
  
  const fetchMembers = async (page) => {
    try {
      const response = await fetch(`http://localhost:5000/alumni/${id}/following?page=${page}&size=${LIMIT}`);
      if (response.ok) {
        const data = await response.json();
        setTotalFollowing(data.totalFollowing);
        setMembers(prevMembers => [...prevMembers, ...data.followingDetails]);
      } else {
        console.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(activePage.current);
  }, []);

  const updateFollowing = () =>{
    activePage.current++;
    fetchMembers(activePage.current);
  }

  return (
    <div style={{ width: '60%', marginTop:'20px'}}>
      <PageTitle title={title} icon={icon} />
      {loading && (
        <div style={{textAlign: 'center'}}> Loading...</div>
      )}
      {members.length > 0 && !loading && (
        <div style={{marginTop: '15px',display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
          {members.map((member) => (
            <Profilecard key={member._id} member={member} name='follow'/>
          ))}
        </div>
      )}
      {members.length === 0 && !loading && (
        <div style={{ textAlign: 'center' }}>No Following</div>
      )}
      {activePage.current < totalFollowing / LIMIT && (
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button className="load-more-button" onClick={updateFollowing}>
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
