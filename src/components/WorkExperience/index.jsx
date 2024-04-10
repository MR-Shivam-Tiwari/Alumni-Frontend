import React, { useState, useEffect } from 'react';
import PageTitle from '../PageTitle';
import { RiBriefcase4Line } from "react-icons/ri";
import { useCookies } from 'react-cookie';
import './workExperience.css';
import { useSelector } from "react-redux";


export const WorkExperience = () => {
    const [workExperiences, setWorkExperiences] = useState([]);
    const icon = <RiBriefcase4Line />;
    const [cookie] = useCookies(['token']);
    const profile = useSelector((state) => state.profile);

    useEffect(() => {
        fetchWorkExperiences();
    }, []);

    const fetchWorkExperiences = async () => {
        try {
            const response = await fetch(`http://localhost:5000/alumni/workExperience/${profile._id}`, {
                headers: {
                    'Authorization': `Bearer ${cookie.token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch work experiences');
            }
            const data = await response.json();
            setWorkExperiences(data);
        } catch (error) {
            console.error('Error fetching work experiences:', error);
        }
    };

    return (
        <div style={{ width: '60%', marginTop: '15px' }}>
            <PageTitle title='Work Experience' icon={icon} />
            <div style={{ marginTop: '15px' }}>
                {workExperiences.map((experience, index) => (
                    <div className="work-experience-card" key={index}>
                        <div className="work-experience-title">{experience.title}</div>
                        <div className="work-experience-company">{experience.companyName}</div>
                        <div className="work-experience-date">{`${experience.startMonth} ${experience.startYear} - ${experience.endMonth} ${experience.endYear || ''}`}</div>
                        <div className="work-experience-location">{experience.location} - {experience.locationType}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
