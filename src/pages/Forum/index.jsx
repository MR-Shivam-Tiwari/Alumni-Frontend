import React, { useState, useEffect } from 'react';
import './forum.css';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import { MdForum } from 'react-icons/md';
import { useSelector } from 'react-redux';
import DisplayForum from '../../components/DisplayForum';

const Forum = () => {
  const [totalForums, setTotalForums] = useState('');
  const [forumData, setForumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const profile = useSelector((state) => state.profile);
  const icon = <MdForum style={{ color: 'rgb(233, 172, 138)' }} />;
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/forums')
      .then((response) => response.json())
      .then((data) => {

        if (profile.profileLevel === 0) {
          console.log('superadmin')
          console.log('forumss', data.forums)
          setForumData(data.forums);
          setLoading(false);
          return;
        }
        // Filter forums based on user's department or "All"
        const filteredForums = data.forums.filter(forum => forum.department === profile.department || forum.department === 'All');

        // Sort based on the selected option
        if (sortBy === 'Most popular') {
          filteredForums.sort((a, b) => b.members.length - a.members.length);
        } else if (sortBy === 'Most recent') {
          filteredForums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setForumData(filteredForums);
        setTotalForums(filteredForums.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching forum data:', error);
      });
  }, [profile.department, sortBy]);

  let admin;
  if (profile.profileLevel === 0 || profile.profileLevel === 1) {
    admin = true;
  }

  return (
    <>
      <div className='forum' style={{ paddingTop: '20px' }}>
        <div>
          <PageTitle title='Forums' icon={icon} />
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '25px', paddingBottom: '25px', alignItems: 'end' }}>
            <p style={{ margin: '0px', fontSize: '18px', fontWeight: '600', color: '#9c9b95' }}>Total Forums:  {loading ? 0 : totalForums}</p>
            <div>
              <FaSearch style={{ position: 'relative', left: 30, bottom: 3, color: '#9c9b95' }} /><input type='text' name='name' id='name' placeholder='Search topics' />
            </div>
            <div>
              <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sort by</option>
                <option value="Most popular">Most popular</option>
                <option value="Most recent">Most recent</option>
              </select>
            </div>
            
          </div>
          <div style={{textAlign: 'center', paddingBottom: '20px'}}>
              {admin && (
                <Link to="/forums/create">
                  <button>Start New Forum</button>
                </Link>
              )}

            </div>
        </div>
        <DisplayForum forumData={forumData} loading={loading} admin={admin} />
      </div>
    </>
  )
}

export default Forum;
