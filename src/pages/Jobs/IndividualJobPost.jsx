import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GiMoneyStack } from 'react-icons/gi';
import { FaLocationDot, FaTags } from 'react-icons/fa6';
import { FcBriefcase } from 'react-icons/fc';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from "react";
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";
import { lineSpinner } from 'ldrs';
import './individualJobPost.css';
import coverImage from '../../../src/images/cultural-1.jpg'

lineSpinner.register()




const IndividualJobPost = () => {
    const { _id, title } = useParams();
    const [cookie] = useCookies(['access_token']);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [starLoading, setStarLoading] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(null);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [candidateModalShow, setCandidateModalShow] = React.useState(false);
    const [appliedCandidates, setAppliedCandidates] = useState([]);
    const [appliedCandidatesDetails, setAppliedCandidatesDetails] = useState([]);
    const [showImagesModal, setShowImagesModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);



    const toggleShareOptions = () => {
        setShowShareOptions(!showShareOptions);
    };
    const profile = useSelector((state) => state.profile);
    const fetchDonationPost = async () => {
        const response = await axios.get(`http://localhost:5000/${title}/${_id}`)
        const data = response.data;
        setJobs(data);
        setLoading(false)
    }

    let admin;
    if (profile.profileLevel === 0) {
        admin = true;
    }


    const fetchAppliedUserIds = async () => {
        console.log('id', _id)
        const response = await axios.get(`http://localhost:5000/${title}/appliedCandidates/${_id}`)
        const data = response.data;
        setAppliedCandidates(data.userIds);
        setAppliedCandidatesDetails(data.appliedCandidates);
    }




    useEffect(() => {
        fetchDonationPost();
        if (title === 'Jobs') {
            fetchAppliedUserIds();
        }
        if (title === 'Internships') {
            fetchAppliedUserIds();
        }
    }, [_id])
    const isApplied = appliedCandidates.includes(profile._id);

    function MyVerticallyCenteredModal(props) {
        const [name, setName] = useState('');
        const [resume, setResume] = useState(null);

        const handleNameChange = (e) => {
            setName(e.target.value);
        };

        const handleResumeChange = (e) => {
            setResume(e.target.files[0]);
        };

        const handleSubmit = () => {
            setApplyLoading(true);
            const apiUrl = `http://localhost:5000/jobs/apply/${_id}`;
            const formData = new FormData();
            console.log('name', name)
            formData.append('userId', profile._id);
            formData.append('name', name);
            formData.append('resume', resume);


            // Dummy POST request
            fetch(apiUrl, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Application submitted successfully!');
                        toast.success("Applied");
                        window.location.reload();
                        setApplyLoading(false);
                        props.onHide();
                    } else {
                        console.error('Failed to submit application');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Apply
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={handleNameChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>Upload Resume</Form.Label>
                            <Form.Control type="file" accept=".pdf" onChange={handleResumeChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                    <Button onClick={handleSubmit}>{applyLoading ? 'Applying...' : 'Apply'}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    const formatCreatedAt = (createdAt) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const timeString = new Date(createdAt).toLocaleTimeString(undefined, options);
        const dateString = new Date(createdAt).toLocaleDateString();

        return `${dateString} ${timeString} `;
    };

    const handleStatusUpdate = (status, comment, userId) => {
        console.log('job id', status,comment,userId)
        setStatusLoading(status);
        // Assuming you have a library like axios for making HTTP requests
        axios.put(`http://localhost:5000/jobs/${_id}/updateJobStatus`, { userId, status, comment })
            .then(response => {
                console.log("Job status updated successfully:", response.data.message);
                fetchAppliedUserIds();
                setStatusLoading(false);
            })
            .catch(error => {
                console.error("Error updating job status:", error.response.data.message);
            });
    };


    const RenderCandidateDetails = () => {
        const [comments, setComments] = useState({});
        const [showCommentBox, setShowCommentBox] = useState(false);
        const [status,setStatus] = useState('')
        if (appliedCandidatesDetails.length === 0) {
            return <p>No interested Candidates</p>;
        }


        const handleApprove = (status,userId) => {
            setComments(prevComments => ({
                ...prevComments,
                [userId]: { showCommentBox: true, comment: '' }
            }));
            setStatus(status);
        };

        const handleReject = (status,userId) => {
            setComments(prevComments => ({
                ...prevComments,
                [userId]: { showCommentBox: true, comment: '' }
            }));
            setStatus(status);
        };

        const handleClose = (userId) => {
            setComments(prevComments => ({
                ...prevComments,
                [userId]: { ...prevComments[userId], showCommentBox: false, comment: '' }
            }));
        };

        const handleSend = (userId) => {
            if (comments[userId].comment.trim() !== '') {
                setShowCommentBox(false);
                handleStatusUpdate(status,comments[userId].comment, userId);
                setComments(prevComments => ({
                    ...prevComments,
                    [userId]: { ...prevComments[userId], showCommentBox: false, comment: '' }
                }));
            }
        };

        return appliedCandidatesDetails.map((candidate, index) => (
            <div key={index}>
                <div style={{ display: 'flex', gap: '1vw' }}>
                    <p style={{ fontWeight: '500' }}>Name: </p><p>{candidate.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '1vw' }}>
                    <p style={{ fontWeight: '500' }}>Resume: </p><a href={`http://localhost:5000/uploads/${candidate.resume}`} target="_blank" rel="noopener noreferrer">{candidate.resume}</a>
                </div>
                <div style={{ display: 'flex', gap: '1vw' }}>
                    <p style={{ fontWeight: '500' }}>Applied At: </p> <p>{formatCreatedAt(candidate.appliedAt)}</p>
                </div>
                {candidate.status ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <p style={{ fontWeight: '600' }}>Status: </p>
                        <p>{candidate.status}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '20px',flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '20px'}}>
                            <button
                                onClick={() => handleApprove('Approved',candidate.userId)}
                                style={{
                                    border: 'none',
                                    padding: '5px 15px',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    borderRadius: '6px'
                                }}
                            >
                                {statusLoading === 'Approved' ? (
                                    <l-line-spinner
                                        size="20"
                                        stroke="3"
                                        speed="1"
                                        color="black"
                                    ></l-line-spinner>
                                ) : (
                                    'Approve'
                                )}
                            </button>

                            <button
                                onClick={() => handleReject('Rejected',candidate.userId)}
                                style={{
                                    border: 'none',
                                    padding: '5px 15px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '6px'
                                }}
                            >
                                {statusLoading === 'Rejected' ? (
                                    <l-line-spinner
                                        size="20"
                                        stroke="3"
                                        speed="1"
                                        color="black"
                                    ></l-line-spinner>
                                ) : (
                                    'Reject'
                                )}
                            </button>

                            <button
                                onClick={() => handleStatusUpdate('In Review', '',candidate.userId)}
                                style={{
                                    border: 'none',
                                    padding: '5px 15px',
                                    backgroundColor: '#c4c400',
                                    color: 'white',
                                    borderRadius: '6px'
                                }}
                            >
                                {statusLoading === 'In Review' ? (
                                    <l-line-spinner
                                        size="20"
                                        stroke="3"
                                        speed="1"
                                        color="black"
                                    ></l-line-spinner>
                                ) : (
                                    'In Review'
                                )}
                            </button>
                        </div>
                        <div>
                        {comments[candidate.userId]?.showCommentBox && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <textarea
                                    value={comments[candidate.userId].comment}
                                    onChange={(e) => setComments(prevComments => ({
                                        ...prevComments,
                                        [candidate.userId]: { ...prevComments[candidate.userId], comment: e.target.value }
                                    }))}
                                    placeholder="Enter your message"
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleSend(candidate.userId)}>Send</button>
                                    <button onClick={() => handleClose(candidate.userId)}>Close</button>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                )}
                <hr />
            </div>
        ));
    };

    const CandidatesModal = () => (
        <Modal
            show={candidateModalShow}
            onHide={() => setCandidateModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Interested Candidates
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RenderCandidateDetails />
            </Modal.Body>
        </Modal>
    );

    const viewCandidatesButton = (
        <button onClick={() => setCandidateModalShow(true)}>View Interested Candidates (<span>{appliedCandidatesDetails.length}</span>)</button>
    );

    const renderImages = () => {
        return jobs.attachments.map((attachment, index) => {
            if (attachment.endsWith('.pdf')) {
                return null; // Skip rendering PDFs
            } else if (attachment.endsWith('.jpg') || attachment.endsWith('.jpeg') || attachment.endsWith('.png')) {
                return (
                    <div key={index} className="image-link">
                        <button style={{ border: 'none', borderBottom: 'solid 1px' }} onClick={() => handleImageClick(`http://localhost:5000/uploads/${attachment}`)}>
                            {attachment}
                        </button>
                    </div>
                );
            } else {
                return null; // Skip rendering unsupported file types
            }
        });
    };
    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowImagesModal(true);
    };

    const handleStarred = (jobId) => {
        setStarLoading(true);
        axios.put(`http://localhost:5000/${title}/${jobId}`, {
            starred: true,
            userId: profile._id
        })
            .then(response => {
                console.log('Job starred successfully:', response.data);
                fetchDonationPost();
                setStarLoading(false);
            })
            .catch(error => {
                console.error('Error starring job:', error);
                // Handle error if needed
            });
            
    };

    const ImagesModal = () => (
        <Modal
            show={showImagesModal}
            onHide={() => setShowImagesModal(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    View Image
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img
                    src={selectedImage}
                    alt="Selected Image"
                    style={{ width: '100%', height: '100%' }}
                />
            </Modal.Body>
        </Modal>
    );
    let starButtonText
    if (jobs.starred) {
        starButtonText = jobs.starred.includes(profile._id) ? 'Starred' : 'Star';
    }
    else starButtonText = 'Star'



    return (
        <div key={jobs._id} style={{ width: '55%', display: 'flex', justifyContent: 'center' }}>
            {loading ? (<div>Loading..</div>) :
                (
                    <div className="ijp-card-container" style={{ backgroundColor: '#f9f9f9' }}>
                        <div className="ijp-card">
                            <div className="ijp-image" style={{ backgroundImage: jobs.coverImage ? `url(${jobs.coverImage})` : `url(${coverImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                            </div>
                            {/* <img src={profile.profilePicture} alt="Profile Image" style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                marginRight: '10px'
                            }} /> */}
                            <div className="ijp-title">
                                <p>{jobs.title}</p>
                            </div>
                            {/* <div className="ijp-user-details">

                                <p>{profile.firstName} </p>

                            </div> */}
                            <div className="ijp-location-bar">
                                <div className="ijp-location">
                                    <FaLocationDot />
                                    <p>{jobs.location}</p>
                                </div>
                                {jobs.employmentType && (
                                    <div className="ijp-jobType">
                                        <FcBriefcase />
                                        <p>{jobs.employmentType}</p>
                                    </div>
                                )}

                                <div className="ijp-category">
                                    <FaTags />
                                    <p>{jobs.category}</p>
                                </div>
                            </div>
                            <div className="ijp-candidates-button">
                                {jobs.userId === profile._id ? (
                                    <>
                                        {viewCandidatesButton}

                                    </>
                                ) : (
                                    isApplied ? (
                                        <>
                                            <button style={{ backgroundColor: '#a3e3ff' }}>Applied</button>
                                            {/* <span style={{fontSize: '15px', color: 'blueviolet', cursor: 'default'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{profile.appliedJobs[0].status? profile.appliedJobs[0].status: null}</span> */}
                                        </>
                                    ) : profile.profileLevel === 0 || profile.profileLevel === 1 ? (
                                        <>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setModalShow(true)} style={{ backgroundColor: '#174873', padding: '7px 20px' }}>Apply</button>
                                            <button style={{ backgroundColor: '#ab021b', marginLeft: '10px', padding: '7px 20px' }} onClick={() => handleStarred(jobs._id)}>{starLoading ? 'Loading...' : starButtonText}</button>
                                            <MyVerticallyCenteredModal
                                                show={modalShow}
                                                onHide={() => setModalShow(false)}
                                            />
                                        </>
                                    )
                                )}
                            </div>

                            <CandidatesModal />

                            <div className="ijp-desc-salary">
                                <div className="ijp-user-details">
                                    <div className="ijp-minimum">
                                        <p >Minimum</p>
                                        <p>{jobs.salaryMin}{jobs.currency}</p>
                                    </div>
                                    <div className="ijp-maximum">
                                        <p>Maximum</p>
                                        <p>{jobs.salaryMax}{jobs.currency}</p>
                                    </div>
                                </div>
                                <div className="ijp-description">
                                    <p style={{ fontWeight: '500' }}>JOB DESCRIPTION:-</p>
                                    {jobs.attachments.map((attachment, index) => {
                                        if (attachment.endsWith('.pdf')) {
                                            return (
                                                <a
                                                    key={index}
                                                    href={`http://localhost:5000/uploads/${attachment}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ display: 'block', marginBottom: '10px' }}
                                                >
                                                    {attachment}
                                                </a>
                                            );
                                        }
                                        return null;
                                    })}
                                    {jobs.description && <p style={{ fontWeight: '500' }}>SKILLS REQUIRED:-</p>}
                                    <p >{jobs.description}</p>
                                </div>
                                <div className="ijp-images">
                                    <p style={{ fontWeight: '600' }}>OTHER DETAILS:-</p>
                                    <div className="image-grid">
                                        {renderImages()}
                                    </div>

                                </div>
                                <div className="ijp-questions" style={{ paddingTop: '20px' }}>
                                    {jobs.questions.length !== 0 && <p style={{ fontWeight: '600' }}>QUESTIONS:</p>}
                                    {jobs.questions.map((question, index) => (
                                        <div key={index}>
                                            <p>{question}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            <ImagesModal />
        </div>
    )


}

export default IndividualJobPost;