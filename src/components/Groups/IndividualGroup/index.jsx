import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import picture from '../../../images/d-group.jpg';
import { Link } from "react-router-dom";
import './IndividualGroup.css';
import SocialMediaPost from "../../Social-wall-post";
import { IoMdInformationCircle } from 'react-icons/io';
import { MdGroup, MdFeed } from 'react-icons/md';
import { BsGlobeAmericas, BsFillTagFill } from 'react-icons/bs';
import { IoIosAdd } from "react-icons/io";
import { Route, Routes } from "react-router-dom";
import { AddMembers } from "../AddMembers";
import { useSelector } from "react-redux";
import { FcInvite } from "react-icons/fc";
import { GroupInvite } from "../GroupInvite";
import { JoinGroup } from "../JoinGroup";

const IndividualGroup = () => {
    const { _id } = useParams();
    const [group, setGroup] = useState([]);
    const profile = useSelector((state) => state.profile);
    console.log('Individual Group')
    let admin;
    if (profile.profileLevel === 0) {
        admin = true;
    }


    const getGroup = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/groups/${_id}`
            );
            setGroup([response.data])
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    }
    useEffect(() => {
        getGroup()
    }, [])

    return (
        <div style={{ width: '100%' }}>
            {group.map((groupItem) => (
                <div key={groupItem._id} className="ig-container">
                    <div className='ig-upper-container' style={{ backgroundImage: `url(${groupItem.groupLogo})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                            <img src={picture} alt="" style={{ width: '7rem', height: '7rem', borderRadius: '50%' }} />
                            <h1 style={{ backgroundColor: '#f3cdcd', marginTop: '10px', borderRadius: '6px', textAlign: 'center', marginLeft: '10px' }}>{groupItem.groupName}</h1>
                            <p style={{ backgroundColor: '#f3cdcd', padding: '6px', borderRadius: '6px' }}>{groupItem.members.length} {groupItem.members.length === 1 ? 'Member' : 'Members'}</p>
                            <div className='display-post-ediit' style={{ width: '50%', background: 'transparent' }}>
                                {(profile._id === groupItem.userId || admin) && <Link to={`/groups/edit/${_id}`}>
                                    <button style={{ backgroundColor: '#f3cdcd', border: '1px solid', width: '100%', borderRadius: '12px' }}>Edit</button>
                                </Link>}
                            </div>
                        </div>
                    </div>
                    <div className="ig-lower-container">
                        <Routes>
                            <Route exact path="/" element={<div style={{ width: '65%' }}>
                                <SocialMediaPost style={{ marginLeft: '0px' }} showCreatePost={true} />
                            </div>} />
                            <Route path="/add" element={<div style={{ width: '65%' }}>
                                <AddMembers type='groups'/>
                            </div>} />
                            <Route path="/groupInvite" element={<div style={{ width: '65%' }}>
                                <GroupInvite />
                            </div>} />
                            <Route path="/invite" element={<div style={{ width: '65%' }}>
                                <JoinGroup />
                            </div>} />
                        </Routes>
                        <div style={{ width: '35%' }}>
                            <div className="ig-lc-card">
                                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid darkgrey', gap: '0.5vw', paddingLeft: '10px', paddingTop: '10px', paddingBottom: '10px' }}>
                                    <IoMdInformationCircle style={{ color: '#174873', width: '25px', height: '25px' }} />
                                    <p style={{ marginBottom: '0px', fontSize: '17px', fontWeight: '500' }}>Info</p>
                                </div>
                                <div>
                                    <ul style={{ listStyle: 'none', paddingLeft: '14px', paddingBottom: '10px' }}>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px', paddingBottom: '10px' }}><MdGroup style={{ color: '#7a7a7a' }} />{groupItem.members.length} {groupItem.members.length === 1 ? 'Member' : 'Members'}</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}><BsGlobeAmericas style={{ color: '#7a7a7a' }} />{groupItem.groupType}</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}><BsFillTagFill style={{ color: '#7a7a7a' }} />{groupItem.category}</li>
                                        {(profile._id === groupItem.userId || admin) && <Link to={`/groups/${_id}/add`} style={{ color: 'black', textDecoration: 'none' }}>
                                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}><IoIosAdd style={{ color: '#7a7a7a', width: '20px', height: '20px' }} />Add/Remove members to/from group</li>

                                        </Link>}
                                        {(profile._id === groupItem.userId || admin) && <Link to={`/groups/${_id}/groupInvite`} style={{ color: 'black', textDecoration: 'none' }}>
                                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}><FcInvite style={{ color: '#7a7a7a', width: '20px', height: '20px' }} />Generate a Group Invite Link</li>

                                        </Link>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default IndividualGroup;