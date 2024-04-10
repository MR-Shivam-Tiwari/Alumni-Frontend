import IntJobs from "../../components/IntJobs";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import PageSubTitle from "../../components/PageSubTitle";
import JobPost from "../../components/JobPost";
import { Archive } from "./Archive";
import { useSelector } from "react-redux";
import { StarredJobs } from "../../components/StarredJobs";
import { AppliedJobs } from "../../components/AppliedJobs";
import { MyJobs } from "../../components/MyJobs";

const Jobs = () => {
    const [title, setTitle] = useState('Jobs');
    const titleS = 'job'
    const entityType = 'jobs';
    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [archivedJobs, setArchivedJobs] = useState([]);
    const [archivedInternships, setArchivedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const buttontext1 = 'All Jobs';
    const [buttontext2, setButtontext2] = useState('');
    const [buttontext3, setButtontext3] = useState('');
    const buttontext1Link = "/jobs";
    const [buttontext2Link, setButtontext2Link] = useState('');
    const [buttontext3Link, setButtontext3Link] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [buttontext4Link, setButtontext4Link] = useState('');
    const [buttontext5Link, setButtontext5Link] = useState('');
    const [buttontext4, setButtontext4] = useState('');
    const [buttontext5, setButtontext5] = useState('');
    const [myJobs, setMyJobs] = useState([]);
    const profile = useSelector((state) => state.profile);
    console.log('search query', searchQuery)


    const getData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/jobs`);

            const filteredJobs = response.data.filter(job => !job.archive && job.approved);
            const filteredArchivedJobs = response.data.filter(job => job.archive && job.approved && job.userId === profile._id);
            const filteredMyJobs = response.data.filter(job => job.userId === profile._id && !job.archive && job.approved);
            setMyJobs(filteredMyJobs);
            setJobs(filteredJobs);
            setArchivedJobs(filteredArchivedJobs);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    console.log('my jobs', myJobs)


    useEffect(() => {
        getData();
    }, []);



    useEffect(() => {


        if (profile.profileLevel === 0 || profile.profileLevel === 1) {
            console.log('profile')
        } else if (profile.profileLevel === 2){
            setButtontext2('Starred');
            setButtontext3('Applied');
            setButtontext4('Archive');
            setButtontext5('My Jobs');
            setButtontext2Link('/jobs/starred');
            setButtontext3Link('/jobs/applied');
            setButtontext4Link('/jobs/archive');
            setButtontext5Link('/jobs/myJobs');
        } else {
            setButtontext2('Starred');
            setButtontext3('Applied');
            setButtontext2Link('/jobs/starred');
            setButtontext3Link('/jobs/applied');
        }
    }, [profile.profileLevel])


    const filteredJobs = jobs.filter(job => {
        const { title, employmentType, category } = searchQuery;
        console.log('search query inside the filtered jobs', searchQuery);
        const lowerCaseJobTitle = title ? title.toLowerCase() : '';
        const lowerCaseJobType = employmentType ? employmentType.toLowerCase() : '';
        const lowerCaseCategory = category ? category.toLowerCase() : '';

        const jobTitleMatch = lowerCaseJobTitle ? job.title.toLowerCase().includes(lowerCaseJobTitle) : true;
        const jobTypeMatch = lowerCaseJobType ? job.employmentType.toLowerCase().includes(lowerCaseJobType) : true;
        const categoryMatch = lowerCaseCategory ? job.category.toLowerCase().includes(lowerCaseCategory) : true;

        return jobTitleMatch && jobTypeMatch && categoryMatch;
    });

    
    const filteredMyJobs = myJobs.filter(job => {
        const { title, employmentType, category } = searchQuery;
        console.log('search query inside the filtered jobs', searchQuery);
        const lowerCaseJobTitle = title ? title.toLowerCase() : '';
        const lowerCaseJobType = employmentType ? employmentType.toLowerCase() : '';
        const lowerCaseCategory = category ? category.toLowerCase() : '';

        const jobTitleMatch = lowerCaseJobTitle ? job.title.toLowerCase().includes(lowerCaseJobTitle) : true;
        const jobTypeMatch = lowerCaseJobType ? job.employmentType.toLowerCase().includes(lowerCaseJobType) : true;
        const categoryMatch = lowerCaseCategory ? job.category.toLowerCase().includes(lowerCaseCategory) : true;

        return jobTitleMatch && jobTypeMatch && categoryMatch;
    });


    const filteredArchivedJobs = archivedJobs.filter(job => {
        const { title, employmentType, category } = searchQuery;
        const lowerCaseJobTitle = title ? title.toLowerCase() : '';
        const lowerCaseJobType = employmentType ? employmentType.toLowerCase() : '';
        const lowerCaseCategory = category ? category.toLowerCase() : '';


        if (employmentType && category) {
            return job.title.toLowerCase().includes(lowerCaseJobTitle) &&
                job.employmentType.toLowerCase() === lowerCaseJobType &&
                job.category.toLowerCase() === lowerCaseCategory;
        }

        else if (employmentType) {
            return job.title.toLowerCase().includes(lowerCaseJobTitle) &&
                job.employmentType.toLowerCase() === lowerCaseJobType;
        }

        else if (category) {
            return job.title.toLowerCase().includes(lowerCaseJobTitle) &&
                job.category.toLowerCase() === lowerCaseCategory;
        }

        return job.title.toLowerCase().includes(lowerCaseJobTitle);
    });



    const handleDropdownSelect = (eventKey) => {
        if (eventKey === 'Internship') {
            setTitle('Internships');
        }
    };


    console.log('filtered jobs and internships', filteredJobs)
    console.log('jobs and internships', jobs)




    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
                <IntJobs
                    title={title}
                    titleS={titleS}
                    handleDropdownSelect={handleDropdownSelect}
                    setSearchQuery={(newQuery) => {
                        setSearchQuery((prevQuery) => {
                            return { ...prevQuery, ...newQuery };
                        });
                    }}
                />
                <Routes>
                    <Route path="/" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext4={buttontext4} buttontext5={buttontext5} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} buttontext4Link={buttontext4Link} buttontext5Link={buttontext5Link} name='jobs' create={false} />
                        </div>
                    } />
                    <Route path="/archive" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext4={buttontext4} buttontext5={buttontext5} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} buttontext4Link={buttontext4Link} buttontext5Link={buttontext5Link} name='jobs' create={false} />
                        </div>
                    } />
                    <Route path="/starred" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext4={buttontext4} buttontext5={buttontext5} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} buttontext4Link={buttontext4Link} buttontext5Link={buttontext5Link} name='jobs' create={false} />
                        </div>
                    } />
                    <Route path="/applied" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext4={buttontext4} buttontext5={buttontext5} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} buttontext4Link={buttontext4Link} buttontext5Link={buttontext5Link} name='jobs' create={false} />
                        </div>
                    } />
                    <Route path="/myJobs" element={
                        <div style={{ marginTop: '215px', zIndex: '1' }}>
                            <PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext4={buttontext4} buttontext5={buttontext5} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} buttontext4Link={buttontext4Link} buttontext5Link={buttontext5Link} name='jobs' create={false} />
                        </div>
                    } />
                </Routes>
                <Routes>
                    <Route path="/archive" element={<>
                        <div className="job-poztt">
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap', paddingTop: '20px' }}>
                                {loading ? (
                                    <div>Loading.....</div>
                                ) : filteredArchivedJobs.length ? (
                                    filteredArchivedJobs.map((job) => (
                                        <div key={job._id} className="job-post">
                                            <Archive
                                                userId={job.userId}
                                                id={job._id}
                                                jobTitle={job.title}
                                                description={job.description}
                                                salaryMin={job.salaryMin}
                                                salaryMax={job.salaryMax}
                                                picture={job.picture}
                                                duration={job.duration}
                                                jobType={job.employmentType}
                                                questions={job.questions}
                                                category={job.category}
                                                currency={job.currency}
                                                createdAt={job.createdAt}
                                                attachments={job.attachments}
                                                type={job.type}
                                                title={title}
                                                titleS={titleS}
                                                searchQuery={searchQuery}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div>No archived jobs</div>
                                )}
                            </div>
                        </div>
                    </>
                    } />
                    <Route path="/starred" element={<>
                        <div className="job-poztt">
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap' }}>
                                <StarredJobs searchQuery={searchQuery} />
                            </div>
                        </div>
                    </>
                    } />
                    <Route path="/myJobs" element={<>
                        <div className="job-poztt">
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap', paddingTop: '20px' }}>
                            {loading ? (
                                    <div>Loading.....</div>
                                ) : filteredMyJobs.length ? (
                                    filteredMyJobs.map((job) => (
                                        <div key={job._id} className="job-post">
                                            <JobPost
                                                userId={job.userId}
                                                id={job._id}
                                                jobTitle={job.title}
                                                description={job.description}
                                                salaryMin={job.salaryMin}
                                                salaryMax={job.salaryMax}
                                                picture={job.picture}
                                                duration={job.duration}
                                                jobType={job.jobType ? job.jobType : job.internshipType}
                                                questions={job.questions}
                                                category={job.category}
                                                currency={job.currency}
                                                createdAt={job.createdAt}
                                                attachments={job.attachments}
                                                title={title}
                                                titleS={titleS}
                                                type={job.type}
                                                searchQuery={searchQuery}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div>No jobs posted</div>
                                )}
                            </div>
                        </div>
                    </>
                    } />
                    <Route path="/applied" element={<>
                        <div className="job-poztt">
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap' }}>
                                <AppliedJobs searchQuery={searchQuery} />
                            </div>
                        </div>
                    </>
                    } />
                    <Route path="/" element={<>
                        <div className="job-poztt">
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap', paddingTop: '20px' }}>
                                {loading ? (
                                    <div>Loading.....</div>
                                ) : filteredJobs.length ? (
                                    filteredJobs.map((job) => (
                                        <div key={job._id} className="job-post">
                                            <JobPost
                                                userId={job.userId}
                                                id={job._id}
                                                jobTitle={job.title}
                                                description={job.description}
                                                salaryMin={job.salaryMin}
                                                salaryMax={job.salaryMax}
                                                picture={job.picture}
                                                duration={job.duration}
                                                jobType={job.jobType ? job.jobType : job.internshipType}
                                                questions={job.questions}
                                                category={job.category}
                                                currency={job.currency}
                                                createdAt={job.createdAt}
                                                attachments={job.attachments}
                                                title={title}
                                                titleS={titleS}
                                                type={job.type}
                                                searchQuery={searchQuery}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div>No jobs posted</div>
                                )}
                            </div>
                        </div>
                    </>} />
                </Routes>
            </div>
        </>
    )
}

export default Jobs;