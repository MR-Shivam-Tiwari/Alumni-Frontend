import IntJobs from "../../components/IntJobs";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import PageSubTitle from "../../components/PageSubTitle";
import { Archive } from "../Jobs/Archive";
import JobPost from "../../components/JobPost";
import { useSelector } from "react-redux";
import { StarredInternships } from "../../components/StarredInternships";
import { AppliedInternships } from '../../components/AppliedInternships';

const Internships = () => {
    const title = 'Internships';
    const titleS = 'internship';
    const entityType = 'jobs';
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [archivedJobs, setArchivedJobs] = useState([]);
    const [archivedInternships, setArchivedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const buttontext1 = 'My Internships';
    const [buttontext2, setButtontext2] = useState('');
    const [buttontext3, setButtontext3] = useState('');
    const buttontext1Link = "/internships";
    const [buttontext2Link, setButtontext2Link] = useState('');
    const [buttontext3Link, setButtontext3Link] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const profile = useSelector((state)=> state.profile);
    console.log('search query intern',searchQuery)
    
    
    
    const getData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/${title}/`)
            if (title === 'Jobs') {
                const filteredJobs = response.data.filter(job => job.archive === false);
                const filteredArchivedJobs = response.data.filter(job => job.archive === true);
                setJobs(filteredJobs);
                setArchivedJobs(filteredArchivedJobs)
                setLoading(false);
            }
            if (title === 'Internships') {
                const filteredInternships = response.data.filter(job => job.archive === false);
                const filteredArchivedInternships = response.data.filter(job => job.archive === true);
                setInternships(filteredInternships);
                setArchivedInternships(filteredArchivedInternships);
                setLoading(false);
            }
        } catch (error) {
            console.log('error')
            return console.log(error);
        }
    }
    

    useEffect(() => {
        getData();
    }, []);


    useEffect(() => {
        // Set button text based on admin status
        if (profile.profileLevel === 0 || profile.profileLevel === 1) {
            setButtontext2('Archive');
            setButtontext2Link('/internships/archive');
        } else {
            setButtontext2('Starred');
            setButtontext3('Applied')
            setButtontext2Link('/internships/starred');
            setButtontext3Link('/internships/applied');
        }
    }, [profile.profileLevel])

    const filteredInternships = internships.filter(job => {
        const { jobTitle, jobType, category } = searchQuery;
        const lowerCaseInternshipTitle = jobTitle ? jobTitle.toLowerCase() : '';
        const lowerCaseInternshipType = jobType ? jobType.toLowerCase() : '';
        const lowerCaseCategory = category ? category.toLowerCase() : '';

        
        if (jobType && category) {
            return job.internshipTitle.toLowerCase().includes(lowerCaseInternshipTitle) &&
                job.internshipType.toLowerCase() === lowerCaseInternshipType &&
                job.category.toLowerCase() === lowerCaseCategory;
        }
       
        else if (jobType) {
            return job.internshipTitle.toLowerCase().includes(lowerCaseInternshipTitle) &&
                job.internshipType.toLowerCase() === lowerCaseInternshipType;
        }
        
        else if (category) {
            return job.internshipTitle.toLowerCase().includes(lowerCaseInternshipTitle) &&
                job.category.toLowerCase() === lowerCaseCategory;
        }
        
        return job.internshipTitle.toLowerCase().includes(lowerCaseInternshipTitle);
    });
    console.log('archived internships',archivedInternships)

    const filteredArchivedInternships = archivedInternships.filter(job => {
        const { jobTitle, jobType, category } = searchQuery;
        const lowerCaseInternshipTitle = jobTitle ? jobTitle.toLowerCase() : '';
        const lowerCaseInternshipType = jobType ? jobType.toLowerCase() : '';
        const lowerCaseCategory = category ? category.toLowerCase() : '';

        
        if (jobType && category) {
            return job.internshipTitle.toLowerCase().includes(lowerCaseInternshipTitle) &&
                job.internshipType.toLowerCase() === lowerCaseInternshipType &&
                job.category.toLowerCase() === lowerCaseCategory;
        }
       
        else if (jobType) {
            return job.internshipTitle.toLowerCase().includes(lowerCaseInternshipTitle) &&
                job.internshipType.toLowerCase() === lowerCaseInternshipType;
        }
        
        else if (category) {
            return job.internshipTitle.toLowerCase().includes(lowerCaseInternshipTitle) &&
                job.category.toLowerCase() === lowerCaseCategory;
        }
        
        return job.internshipTitle.toLowerCase().includes(lowerCaseInternshipTitle);
    });

    


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
                <IntJobs title={title} titleS={titleS}  setSearchQuery={(newQuery) => {
                        setSearchQuery((prevQuery) => {
                            return { ...prevQuery, ...newQuery };
                        });
                    }}/>
                <Routes>
                    <Route path="/" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} name='internships' create={false} />
                        </div>
                    } />
                    <Route path="/archive" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='internships' create={false} />
                        </div>
                    } />
                    <Route path="/starred" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2}  buttontext3={buttontext3} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} name='internships' create={false} />
                        </div>
                    } />
                    <Route path="/applied" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2}  buttontext3={buttontext3} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} name='internships' create={false} />
                        </div>
                    } />
                </Routes>
                <Routes>
                    <Route path="/archive" element={<>
                        <div className="job-poztt" style={{paddingTop: '20px'}}>
                            {loading ? (
                                <div>Loading Internships.....</div>
                            ) : filteredArchivedInternships.length ? (
                                filteredArchivedInternships.map((internship) => (
                                    <div key={internship._id} className="job-post">

                                        <Archive
                                            userId={internship.userId}
                                            id={internship._id}
                                            jobTitle={internship.internshipTitle}
                                            description={internship.description}
                                            salaryMin={internship.salaryMin}
                                            salaryMax={internship.salaryMax}
                                            picture={internship.picture}
                                            duration={internship.duration}
                                            jobType={internship.internshipType}
                                            questions={internship.questions}
                                            category={internship.category}
                                            currency={internship.currency}
                                            createdAt={internship.createdAt}
                                            attachments={internship.attachments}
                                            title={title}
                                            titleS={titleS}
                                            searchQuery={searchQuery}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div>No archived internships</div>
                            )}
                        </div>
                    </>
                    } />
                     <Route path="/starred" element={<>
                        <div className="job-poztt">
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap' }}>
                                        <StarredInternships searchQuery={searchQuery}/>
                                    </div>
                                </div>
                    </>
                    } />
                    <Route path="/applied" element={<>
                        <div className="job-poztt">
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap' }}>
                                        <AppliedInternships searchQuery={searchQuery}/>
                                    </div>
                                </div>
                    </>
                    } />
                    <Route path="/" element={<>
                        <div className="job-poztt">
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap', paddingTop: '20px' }}>
                                {loading ? (
                                    <div>Loading Internships.....</div>
                                ) : filteredInternships.length ? (
                                    filteredInternships.map((internship) => (
                                        <div key={internship._id} className="job-post">

                                            <JobPost
                                                userId={internship.userId}
                                                id={internship._id}
                                                jobTitle={internship.internshipTitle}
                                                description={internship.description}
                                                salaryMin={internship.salaryMin}
                                                salaryMax={internship.salaryMax}
                                                picture={internship.picture}
                                                duration={internship.duration}
                                                jobType={internship.internshipType}
                                                questions={internship.questions}
                                                category={internship.category}
                                                currency={internship.currency}
                                                createdAt={internship.createdAt}
                                                attachments={internship.attachments}
                                                title={title}
                                                titleS={titleS}
                                                searchQuery={searchQuery}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div>No internships posted</div>
                                )}
                            </div>
                        </div>
                    </>} />
                </Routes>
            </div>
        </>
    )
}

export default Internships;