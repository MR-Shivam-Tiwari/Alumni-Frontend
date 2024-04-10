import './displayDonSpon.css';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { lineSpinner } from 'ldrs'

lineSpinner.register()



const DisplayDonSpon = ({ donations, name, updateDonations, totalDonations, page, limit, loading, isLoading }) => {
    const location = useLocation();
    const profile = useSelector((state) => state.profile);
    const [edit, setEdit] = useState(false);
    const navigateTo = useNavigate();
    const [displayCount, setDisplayCount] = useState(2);

    useEffect(() => {
        if (location.pathname === '/donations/my-donation-requests' || location.pathname === '/sponsorships/my-sponsorship-requests') {
            setEdit(true);
        } else {
            setEdit(false)
        }
    }, [location.pathname]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleDelete = async (_id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/${name}/${_id}`);
            toast.success(`Successfully deleted ${name} details`);
            if (name === "donations") {
                setTimeout(() => {
                    navigateTo('/donations');
                    window.location.reload();
                }, 1000);
            }

            if (name === "sponsorships") {
                setTimeout(() => {
                    navigateTo('/sponsorships');
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleLoadMore = () => {
        updateDonations();
    }

    return (
        <>
            <div className="donSpon-container">
                {donations !== undefined && donations.length > 0 ? (
                    donations.map((donation) => (
                        <div key={donation._id} className='donSpon-card'>
                            <div className="donation-card-image">
                                <img src={donation.picturePath} alt="" className="src" />
                            </div>
                            <div style={{ paddingLeft: '12px', height: '20%' }}>
                                <Link to={`/${name}/${donation._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    <button style={{ border: '1px', padding: '5px', backgroundColor: "white" }}>
                                        <div className="donation-card-title">
                                            <h2>{donation.title}</h2>
                                        </div>
                                    </button>
                                </Link>
                                <div className="user-details">
                                    <img src={donation.profilePic} alt="Profile Image" />
                                    <p>
                                        {donation.userName} <span style={{ marginLeft: '10px' }}>.</span> <span style={{ marginLeft: '10px' }}>{formatDate(donation.createdAt)}</span>
                                    </p>
                                </div>
                            </div>
                            {edit ? (
                                <div className="edit-delete-buttons">
                                    <Link to={`/${name}/edit/${donation._id}`} style={{width: 'calc(50% - 18px)'}}>
                                    <button style={{width: '100%'}}>Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(donation._id)} style={{backgroundColor: 'rgb(244 67 54 / 20%)', color: '#f44336'}}>Delete</button>
                                </div>
                            ) : (
                                <div className="donation-card-bar">
                                    <div className="donation-amount">
                                        <span style={{ fontSize: '15px' }}>Rs</span>
                                        <span id="raised-amount" style={{ fontSize: '15px' }}>
                                            {donation.raisedAmount} raised of
                                        </span>
                                    </div>
                                    <div className='ids-bar'>
                                        <div
                                            className='ids-fill-bar'
                                            style={{
                                                width: `${(donation.raisedAmount / donation.totalAmount) * 100}%`,
                                                backgroundColor: 'greenyellow'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="donation-target">
                                        <span style={{ fontSize: '15px' }}>of Rs </span>
                                        <span id="target-amount" style={{ fontSize: '15px' }}>{donation.totalAmount}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : loading ? (
                    <div style={{display: 'flex', width: '100%', height: '50vh', alignItems: 'center', justifyContent: 'center'}}>
                    <l-line-spinner
                      size="40"
                      stroke="3"
                      speed="1" 
                      color="black" 
                    ></l-line-spinner></div>
                ) : (
                    <div>No {name}</div>
                )}
            </div>
            {isLoading && (
                <div style={{ textAlign: 'center' }}> <l-line-spinner
                size="25"
                stroke="3"
                speed="1" 
                color="black" 
              ></l-line-spinner></div>
            )}
            {page < totalDonations / limit && (
                <div style={{ textAlign: 'center' }}>
                    <button className="load-more-button" onClick={handleLoadMore}>
                        Load More
                    </button>
                </div>
            )}
        </>
    )
}

export default DisplayDonSpon;
