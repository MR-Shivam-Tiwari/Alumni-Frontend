import React, { useState } from 'react';
import profilepic from '../../images/profilepic.jpg'; // Import the user's profile picture
import './sideWidgets.css'
import picture from '../../images/pexels-damon-hall-2274725.jpg'
import { HiUsers } from 'react-icons/hi';
import { TbReload } from 'react-icons/tb';
import { BsEnvelopePaperHeartFill, BsFillArrowRightSquareFill } from 'react-icons/bs'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';



const SideWidgets = () => {
    const [cookie, setCookie] = useCookies(["access_token"]);
    const profile = useSelector((state) => state.profile);
    const [posts, setPosts] = useState([
        // Define an array of sample posts (you can fetch real posts from an API)
        {
            id: 1,
            user: 'user1',
            caption: 'This is my first post!',
            media: picture, // Replace with the URL of the media (image or video)
            likes: 10,
            comments: [
                { id: 1, user: 'user2', text: 'Great post!' },
                { id: 2, user: 'user3', text: 'I love it!' },
            ],
        },
        // Add more posts here
    ]);

    return (
        <div className="sideWidget-feed">
            {posts.map((post) => (
                <div key={post.id} className="sideWidget-post-card">
                    <div className="sideWidget-post-header">
                        <img src={post.media} alt="Post Media" className="sideWidget-post-media" />

                    </div>
                    <div style={{ marginTop: '-20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={profilepic} alt="Profile" width="60px" height="60px" style={{ borderRadius: '50%' }} />
                        <Link to='/profile' style={{textDecoration: 'none', color: 'black'}}>
                            <p style={{ marginBottom: '0rem', fontWeight: '500' }}>{profile.firstName}</p>
                        </Link>
                        <p style={{ marginBottom: '0rem' }}>@{profile.firstName}</p>
                    </div>
                    <div style={{ height: '20%' }}>
                        <ul style={{ marginLeft: '-30px', display: 'flex', gap: '10px' }}>
                            <li style={{ display: 'inline-block', borderRight: '1px solid #e9e9e9', textAlign: 'center', paddingRight: '7px' }}><a href="" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'black' }}><span>Posts</span><span>5</span></a></li>
                            <li style={{ display: 'inline-block', borderRight: '1px solid #e9e9e9', textAlign: 'center', paddingRight: '7px' }}><a href="" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'black' }}><span>Following</span><span>1</span></a></li>
                            <li style={{ display: 'inline-block', textAlign: 'center' }}><a href="" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'black' }}><span>Followers</span><span>1</span></a></li>
                        </ul>
                    </div>
                </div>
            ))}
            {posts.map((post) => (
                <div key={post.id} className="sideWidget2-post-card">
                    <div className="sideWidget2-post-header">
                        <p style={{ marginBottom: '0rem', fontWeight: '500' }}>People You May Know</p>
                        <button style={{ border: 'none', backgroundColor: 'white' }}><TbReload /></button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', border: '1px solid #e9e9e9', borderRadius: '10px', width: '40%', marginLeft: '20px', height: '21vh' }}>
                        <img src={profilepic} alt="Profile" width="60px" height="60px" style={{ borderRadius: '50%' }} />
                        <p style={{ marginBottom: '0rem', fontWeight: '500' }}>alumni1</p>
                        <button style={{ backgroundColor: '#1a9dea', color: 'white', borderRadius: '10px', borderColor: 'white' }}>Follow</button>
                    </div>
                </div>
            ))}
            <div className='online'>
                <HiUsers style={{ color: '#0095cf', height: '35px', width: '85px' }} />
                <p style={{ marginBottom: '0rem' }}><span>1</span> Online User</p>
            </div>
            <div className='invite'>
                <BsEnvelopePaperHeartFill style={{ width: '50px', height: '50px', color: '#f6bb42' }} />
                <p style={{ marginBottom: '0rem' }}>Invite Your Friends</p>
                <div className='sideWidget-email'>
                    <input type="text" placeholder='E-mail' />
                    <button style={{ border: 'none', background: 'transparent', padding: '0' }}><BsFillArrowRightSquareFill style={{ color: '#174873', width: '30px', height: '30px' }} /></button>
                </div>
            </div>
            <div className="sideWidget2-activities">
                <div className="sideWidget2-activities-post-header">
                    <p style={{ marginBottom: '0rem', fontWeight: '500' }}>Latest Activities</p>
                    <button style={{ border: 'none', backgroundColor: 'white' }}><TbReload /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '7px', paddingLeft: '5px', paddingRight: '5px', height: '11vh' }}>
                    <img src={profilepic} alt="Profile" width="40px" height="40px" style={{ borderRadius: '50%' }} />
                    <p style={{
                        marginBottom: '0rem', fontSize: '15px',
                        backgroundColor: '#f0f2f5',
                        borderRadius: '18px',
                        padding: '5px 12px'
                    }}>Alumni A started following admin</p>
                </div>
            </div>
        </div>
    );
};

export default SideWidgets;
