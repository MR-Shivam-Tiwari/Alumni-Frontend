import React from "react";
import "./icons.css";
import { CiViewTimeline } from "react-icons/ci";
import { LiaObjectGroupSolid } from "react-icons/lia";
import { AiTwotoneLike } from "react-icons/ai";
import { HiUserAdd } from "react-icons/hi";
import { HiUsers } from "react-icons/hi";
import { HiPhotograph } from "react-icons/hi";
import { BiSolidVideo } from "react-icons/bi";
import { Link,useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Icons = () => {
  const profile = useSelector((state)=> state.profile);
  const { id } = useParams();
  return (
    <>
      <div style={{display:'flex',justifyContent:'center',marginTop:'-30px'}}>
        <div className="icon">
          <div>
            <center><CiViewTimeline /></center>
            <p style={{marginBottom:'0px' }}>Timeline</p>
          </div>
          
          <div>
           <center><LiaObjectGroupSolid /></center>
           <Link to={`/groups/${profile._id}/joined-groups`} style={{textDecoration: 'none', color: 'black'}}>
            <p style={{marginBottom: '0px'}}>Groups</p>
            </Link>
          </div>
          
          <Link to={`/profile/${profile._id}/following`} style={{textDecoration: 'none', color: 'black'}}>
          <div>
          <center><HiUserAdd /></center>
            <p style={{marginBottom: '0px'}}>Following</p>
          </div>
          </Link>
          <Link to={`/profile/${profile._id}/followers`} style={{textDecoration: 'none', color: 'black'}}>
          <div>
          <center><HiUsers /></center>
            <p style={{marginBottom: '0px'}}>Followers</p>
          </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Icons;
