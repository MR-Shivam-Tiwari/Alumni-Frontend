import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import backgroundPicture1 from '../../images/pexels-mohamed-abdelghaffar-771742.jpg';
import picture from '../../images/profilepic.jpg';
import './individualDonSpon.css';
import { RiInformationFill } from 'react-icons/ri';
import { FaFacebookSquare, FaTwitter, FaInstagram, FaLinkedin, FaPinterestSquare } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from "react-redux";


const IndividualDonSpon = () => {
    const params = useParams();
    const { _id, name } = useParams();
    const location = useLocation();
    const [donations, setDonations] = useState([]);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const shareButtonRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const profile = useSelector((state) => state.profile);

    useEffect(() => {
        setIsLoading(true); // Set loading to true while fetching data
        if (location.pathname.includes('/sponsorships')) {
            fetch(`http://localhost:5000/sponsorships/${_id}`)
                .then((response) => response.json())
                .then((data) => {
                    setDonations([data]);
                    setIsLoading(false); // Set loading to false when data is available
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setIsLoading(false); // Set loading to false in case of an error
                });
        }
        if (location.pathname.includes('/donations')) {
            fetch(`http://localhost:5000/donations/${_id}`)
                .then((response) => response.json())
                .then((data) => {
                    setDonations([data]);
                    setIsLoading(false); // Set loading to false when data is available
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setIsLoading(false); // Set loading to false in case of an error
                });
        }
    }, [location.pathname, _id]);
    console.log('I-donations', donations)

    const handleShareClick = () => {
        setShowShareOptions(!showShareOptions);
    };

    const handleShareOptionClick = (link) => {
        window.open(link, '_blank'); // Open the link in a new tab
        setShowShareOptions(false); // Close the share options
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (shareButtonRef.current && !shareButtonRef.current.contains(e.target)) {
                setShowShareOptions(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div style={{ height: '75vh', marginTop: '20px' }}>
            {isLoading || donations === undefined ? (
                <p>Loading...</p> 
            ) : (
                <div style={{ height: '100%', width: '100%' }}>
                    {donations.map((donation) => (
                        <div className="ids-upper" key={donation._id}>
                            <div className="ids-details" style={{ backgroundImage: `url(${donation.picturePath})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                <div className="ids-user-details">
                                    <img src={profile.profilePicture} alt="Profile Image" />
                                    <p>
                                        {donation.userName} <span style={{ marginLeft: '10px' }}>.</span> <span style={{ marginLeft: '10px' }}>{formatDate(donation.createdAt)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="ids-amount">
                                <p style={{ marginTop: '1rem', marginBottom: '0rem', color: '#174873', fontSize: '30px', fontWeight: '400' }}>₹ {donation.raisedAmount}</p>
                                <p>Raised of ₹{donation.totalAmount}</p>
                                <div className="ids-bar">
                                    <div
                                        className="ids-fill-bar"
                                        style={{
                                            width: `${(donation.raisedAmount / donation.totalAmount) * 100}%`,
                                            backgroundColor: 'greenyellow'
                                        }}
                                    ></div>
                                </div>
                                <p style={{ marginTop: '1rem', marginBottom: '0rem', color: '#174873', fontSize: '30px', fontWeight: '400' }}>{donation.totalContributions}</p>
                                <p>Total Contributions</p>
                                <div ref={shareButtonRef} >
                                    <button className="ids-amount-button" onClick={handleShareClick}>Share</button>
                                    {showShareOptions && (
                                        <div className="share-options">
                                            <button onClick={() => handleShareOptionClick('https://www.facebook.com')}><FaFacebookSquare /></button>
                                            <button onClick={() => handleShareOptionClick('https://www.twitter.com')}><FaTwitter /></button>
                                            <button onClick={() => handleShareOptionClick('https://www.instagram.com')}><FaInstagram /></button>
                                            <button onClick={() => handleShareOptionClick('https://www.linkedin.com')}><FaLinkedin /></button>
                                            <button onClick={() => handleShareOptionClick('https://www.pinterest.com')}><FaPinterestSquare /></button>
                                        </div>
                                    )}
                                    
                                </div>
                                {donations[0]?.userId !== profile._id && ( 
                                        <button className="ids-amount-button" style={{backgroundColor: '#f44336', marginTop: '25px'}}>Donate</button>
                                    )}
                            </div>
                        </div>
                    ))}
                    {isLoading || donations === undefined ? (
                        <div className="ids-lower">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        donations.map((donation) => (
                            <div className="ids-lower">
                                <div className="ids-info">
                                    <RiInformationFill style={{ color: '#174873', width: '25px', height: '25px' }} />
                                    <p style={{
                                        marginBottom: '0rem',
                                        fontWeight: '600'
                                    }}>Info</p>
                                </div>
                                <hr style={{ margin: '0.5rem' }} />
                                <p style={{ paddingLeft: '15px', paddingBottom: '12px' }}>{donation.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );


}

export default IndividualDonSpon;
