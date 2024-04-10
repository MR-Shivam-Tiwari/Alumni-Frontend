import { Link } from 'react-router-dom';
import './left-sidebar.css'
import { FaHeart, FaBriefcase } from 'react-icons/fa';
import { HiUserGroup, HiOutlineBriefcase } from 'react-icons/hi';
import { BsGlobe, BsCurrencyRupee } from 'react-icons/bs';
import { MdForum, MdOutlineEvent, MdSettings, MdOutlineLogout } from 'react-icons/md';
import { BiNews } from 'react-icons/bi';
import { GoSponsorTiers } from 'react-icons/go';
import { RxDashboard } from 'react-icons/rx';
import { updateMember } from "../../store/membersSlice";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { IoIosNotifications } from "react-icons/io";


const LeftSidebar = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('http://localhost:5000/alumni/all');
                if (response.ok) {
                    const membersData = await response.json();
                    console.log('members data',membersData)
                    dispatch(updateMember(membersData)); 
                } else {
                    throw new Error('Failed to fetch members');
                }
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div style={{ width: '20%', marginLeft: '25px' }}>
                <div className='sideBar'>
                    <ul>
                        <li><a href="/" style={{ textDecoration: 'none' }}><RxDashboard style={{ color: 'greenyellow' }} /><p>Dashboard</p></a></li>
                        {/* <li><Link to="/socialWall" style={{ textDecoration: 'none' }}><FaHeart style={{ color: '#fd546b' }} /><p>Social Wall</p></Link></li> */}
                        <li><Link to="/members" style={{ textDecoration: 'none' }}><BsGlobe style={{ color: '#87dbf2' }} /><p>Members</p></Link></li>
                        <li><Link to="/groups" style={{ textDecoration: 'none' }}><HiUserGroup style={{ color: '#ffcf63' }} /><p>Groups</p></Link></li>
                        <li><Link to="/chat" style={{ textDecoration: 'none' }}><MdSettings style={{ color: '#b744b7' }} /><p>Chat</p></Link></li>
                        <li><Link to="/forums" style={{ textDecoration: 'none' }}><MdForum style={{ color: '#e9ac8a' }} /><p>Forums</p></Link></li>
                        <li><Link to="/news" style={{ textDecoration: 'none' }}><BiNews style={{ color: '#fc7950' }} /><p>News</p></Link></li>
                        <li><Link to="/donations" style={{ textDecoration: 'none' }}><BsCurrencyRupee style={{ color: '#c8d1da' }} /><p>Business Connect</p></Link></li>
                        <li><Link to="/sponsorships" style={{ textDecoration: 'none' }}><GoSponsorTiers style={{ color: '#d8887d' }} /><p>Sponsorships</p></Link></li>
                        <li><Link to="/events" style={{ textDecoration: 'none' }}><MdOutlineEvent style={{ color: '#f5cb4a' }} /><p>Events</p></Link></li>
                        <li><Link to="/jobs" style={{ textDecoration: 'none' }}><FaBriefcase style={{ color: '#407093' }} /><p>Jobs/Internships</p></Link></li>
                        {/* <li><Link to="/internships" style={{ textDecoration: 'none' }}><HiOutlineBriefcase style={{ color: '#407093' }} /><p>Internships</p></Link></li> */}
                        <li><Link to="/notifications" style={{ textDecoration: 'none' }}><IoIosNotifications style={{ color: '#b744b7' }} /><p>Notifications</p></Link></li>
                        <li><Link to="/settings" style={{ textDecoration: 'none' }}><MdSettings style={{ color: '#b744b7' }} /><p>Settings</p></Link></li>
                    </ul>
                </div>
        </div>
    )
}

export default LeftSidebar;