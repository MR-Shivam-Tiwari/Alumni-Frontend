
import coverImage from '../../../../src/images/cultural-1.jpg'
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useState, useEffect } from "react";
//import { useSelector } from "react-redux";
import { GiMoneyStack } from 'react-icons/gi';
import { FaLocationDot, FaTags } from 'react-icons/fa6';
import { FcBriefcase } from 'react-icons/fc';
import profilePic from '../../../images/profilepic.jpg'

import './individualJobPost.css';
const JobIntDisplay = ({ picture, jobId, jobTitle, location, salaryMin, salaryMax, currency, jobType, category, description }) => {
    // const { _id,title } = useParams();
    const [cookie] = useCookies(['access_token']);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const title = 'Jobs'
    console.log('titleijb', title)

    // const toggleShareOptions = () => {
    //     setShowShareOptions(!showShareOptions);
    // };
    // const profile = useSelector((state) => state.profile);
    // const fetchDonationPost = async () => {
    //     const response = await axios.get(`http://localhost:5000/${title}/${_id}`)
    //     const data = response.data;
    //     setJobs(data);
    //     setLoading(false)
    // }

    // useEffect(() => {
    //     fetchDonationPost();
    // }, [])


    return (
        <div key={jobs._id}>
            {loading ? (<div>Loading..</div>) :
                (
                    <div className="ijp-card-container">
                        <div className="ijp-card">
                            <div className="ijp-image" style={{ backgroundImage: picture ? `url(${picture})` : `url(${coverImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                                {/* Content goes here */}
                            </div>
                            {/* <img src={profilePic} alt="Profile Image" style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                marginRight: '10px'
                            }} /> */}
                            <div className="ijp-title">
                                <p>{title === 'Jobs' ? jobTitle : title === 'Internships' ? jobs.internshipTitle : ''}</p>
                            </div>
                            {/* <div className="ijp-user-details">

                                <p>admin </p>

                            </div> */}
                            <div className="ijp-location-bar">
                                <div className="ijp-location">
                                    <FaLocationDot />
                                    <p>{location}</p>
                                </div>
                                <div className="ijp-jobType">
                                    <FcBriefcase />
                                    <p>{title === 'Jobs' ? jobType : title === 'Internships' ? jobs.internshipType : ''}</p>
                                </div>
                                <div className="ijp-category">
                                    <FaTags />
                                    <p>{category}</p>
                                </div>
                            </div>
                            <div className="ijp-candidates-button">
                                <button>View Interested Candidates (<span>0</span>)</button>
                            </div>

                            <div className="ijp-desc-salary">
                                <div className="ijp-user-details">
                                    <div className="ijp-minimum">
                                        <p >Minimum</p>
                                        <p>{salaryMin}{currency}</p>
                                    </div>
                                    <div className="ijp-maximum">
                                        <p>Maximum</p>
                                        <p>{salaryMax}{currency}</p>
                                    </div>
                                </div>
                                <div className="ijp-description">
                                    <p>{title === 'Jobs' ? 'Job Description' : title === 'Internships' ? 'Internship Description' : ''}</p>
                                    <p style={{ fontSize: 'small', marginTop: '-15px' }}>{description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )


}

export default JobIntDisplay;