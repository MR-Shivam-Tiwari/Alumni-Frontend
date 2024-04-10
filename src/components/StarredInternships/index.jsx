import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import JobPost from '../JobPost';

export const StarredInternships = ({searchQuery}) => {
    const profile = useSelector((state) => state.profile);
    const [starredInternships, setStarredInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStarredInternships = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/internships/starred/${profile._id}`);
                setStarredInternships(response.data.internships);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching starred internships:', error);
                setLoading(false);
            }
        };

        fetchStarredInternships();
    }, [profile._id]);
    console.log('starred internships', starredInternships)

    const filteredInternships = starredInternships.filter(job => {
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
        <div className="job-poztt" style={{width: '100%'}}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '5vw', flexWrap: 'wrap', paddingTop: '20px',width: '100%' }}>
                {loading ? (
                    <div>Loading...</div>
                ) : filteredInternships.length === 0 ? (
                    <div>No starred internships found.</div>
                ) : (<div style={{width: '100%',display: 'flex', gap: '4vw',flexWrap: 'wrap'}}>

                    {filteredInternships.map((job) => (
                        <div key={job._id} className="job-post" style={{width: '45%'}}>
                            <JobPost
                                userId={job.userId}
                                id={job._id}
                                jobTitle={job.internshipTitle}
                                description={job.description}
                                salaryMin={job.salaryMin}
                                salaryMax={job.salaryMax}
                                picture={job.picture}
                                duration={job.duration}
                                jobType={job.jobType}
                                questions={job.questions}
                                category={job.category}
                                currency={job.currency}
                                createdAt={job.createdAt}
                                attachments={job.attachments}
                                title='Internships'
                                titleS='internship'
                            />
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};
