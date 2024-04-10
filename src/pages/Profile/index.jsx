import React from "react";
import { useParams } from "react-router-dom"; 
import "./profile.css";
import picture from "../../images/d-cover.jpg";
import { BiUserPlus } from 'react-icons/bi'
import { LuMessageSquare } from 'react-icons/lu'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Icons from '../../components/Icons'
import Icons1 from "../../components/Icons1";
import { useSelector } from "react-redux";

const Profile = () => {
  const { id } = useParams(); 
  console.log('member id',id);
  const members = useSelector((state) => state.member);  
  const member = members.find(member => member._id === id);

  if (!member) {
    return <div>Member not found</div>; 
  }

  return (
    <>
      <div style={{width: '60%'}}>
        <div
          className="ple"
          style={{
            backgroundImage: `url(${member.coverPicture})`,
            height: "35.86vh",
            backgroundSize: "cover",
            borderRadius: "0px 0px 10px 10",
            display: 'flex',
            alignItems: 'end',
            paddingBottom: '60px'
          }}
        >
          <div>
            <img src={member.profilePicture} alt="Profile" /> 
          </div>
          <div style={{ paddingBottom: '1.5em' }}>
            <h2 style={{ color: "white" }}>{member.firstName}</h2> 
            <div style={{ display: 'flex', gap: '0.5em' }}>
              <button style={{ backgroundColor: '#178AC2', color: 'white', border: 'none' }}><BiUserPlus /> Follow</button>
              <button><LuMessageSquare />  Message</button>
              <button><BsThreeDotsVertical /></button>
            </div>
          </div>
        </div>
        {/* <Icons /> */}
        <Icons1 />
      </div>
    </>
  );
};

export default Profile;
