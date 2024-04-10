import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { lineSpinner } from 'ldrs';
import Profilecard from '../Profilecard';
import DisplayPost from '../DisplayPost';
import DisplayForum from '../DisplayForum';
import JobPost from '../JobPost';

lineSpinner.register()


export const SearchedResults = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get('search');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchKeyword = searchParams.get('search');

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/search/search?keyword=${searchKeyword}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSearchResults(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults(null);
      }
    };

    if (searchKeyword) {
      fetchSearchResults();
    }
  }, [location.search]);
  console.log('search results component', searchResults)

  return (
    <div style={{ paddingTop: '30px', width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {loading && <l-line-spinner
        size="40"
        stroke="3"
        speed="1"
        color="black"
      ></l-line-spinner>}
      {!loading && searchResults && (
        <>
          {searchResults.alumni && searchResults.alumni.length !== 0 && (
            <div style={{ width: '100%',padding: '10px 0px' }}>
              <h3>Members</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '20px ' }}>
                {searchResults.alumni.map((item, index) => (
                  <Profilecard
                    key={item._id}
                    member={item}

                  />
                ))}
              </div>

            </div>
          )}
          {searchResults.forum && searchResults.forum.length !== 0 && (
            <div style={{ width: '100%',padding: '10px 0px'}}>
              <h3>Forums</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <DisplayForum forumData={searchResults.forum} />
              </div>
            </div>
          )}
          {searchResults.group && searchResults.group.length !== 0 && (
            <div style={{ width: '100%',padding: '10px 0px' }}>
              <h3>Groups</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <DisplayPost groups={searchResults.group} />
              </div>
            </div>
          )}
          {searchResults.internship && searchResults.internship.length !== 0 && (
            <div style={{ width: '100%',padding: '20px 0px' }}>
              <h3>Internships</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '20px ' }}>
                {searchResults.internship.map((item, index) => (
                  <div key={item._id} className="job-post">
                  <JobPost
                    userId={item.userId}
                    id={item._id}
                    jobTitle={item.internshipTitle}
                    description={item.description}
                    salaryMin={item.salaryMin}
                    salaryMax={item.salaryMax}
                    picture={item.picture}
                    duration={item.duration}
                    jobType={item.internshipType}
                    questions={item.questions}
                    category={item.category}
                    currency={item.currency}
                    createdAt={item.createdAt}
                    attachments={item.attachments}
                    title='Internships'
                    titleS='internship'
                  />
                </div>
                ))}
              </div>
            </div>
          )}
          {searchResults.job && searchResults.job.length !== 0 && (
            <div style={{ width: '100%',padding: '20px 0px' }}>
              <h3>Jobs</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '20px ' }}>
                {searchResults.job.map((item, index) => (
                  <div key={item._id} className="job-post">
                    <JobPost
                      userId={item.userId}
                      id={item._id}
                      jobTitle={item.jobTitle}
                      description={item.description}
                      salaryMin={item.salaryMin}
                      salaryMax={item.salaryMax}
                      picture={item.picture}
                      duration={item.duration}
                      jobType={item.jobType}
                      questions={item.questions}
                      category={item.category}
                      currency={item.currency}
                      createdAt={item.createdAt}
                      attachments={item.attachments}
                      title='Jobs'
                      titleS='job'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {Object.values(searchResults).every(result => result.length === 0) && (
            <p>No search results for '{searchKeyword}'</p>
          )}
        </>
      )}
    </div>
  );
};
