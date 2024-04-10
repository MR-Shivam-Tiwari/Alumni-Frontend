import './sponsorships.css'
import '../../components/DonSpon'
import DonSpon from '../../components/DonSpon';
import PageSubTitle from '../../components/PageSubTitle';
import { Route, Routes } from "react-router-dom";
// import MySponsorshipRequests from '../../components/Sponsorships/MySponsorshipRequests';
import BrowseDonations from '../../components/BrowseDonations';
import { GoSponsorTiers } from 'react-icons/go';
import { useState, useEffect } from 'react';
import picture from '../../images/profilepic.jpg';
import backgroundPicture1 from '../../images/pexels-mohamed-abdelghaffar-771742.jpg';
import backgroundPicture2 from '../../images/pexels-tyler-lastovich-590179.jpg';
import backgroundPicture3 from '../../images/bgimg.jpg';
import IndividualDonSpon from '../../components/IndividualDonSpon';
import DonSponRequest from '../../components/DonSponRequest';
import axios from 'axios';
import { useSelector } from 'react-redux';


const Sponsorships = () => {
  const title = 'Sponsorships';
  const icon = <GoSponsorTiers />;
  const buttontext1 = 'Browse Sponsorships';
  const buttontext2 = 'My Sponsorship Requests';
  const buttontext1Link = "/sponsorships";
  const buttontext2Link = "/sponsorships/my-sponsorship-requests";
  const [donations, setDonations] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const profile = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const LIMIT = 4;
  let [page, setPage] = useState(1);
  let [previousPage, setPreviousPage] = useState(0);
  let admin;
  if (profile.profileLevel === 0 || profile.profileLevel === 1) {
    admin = true;
  }


  const getPosts = async () => {
    setLoading(true)
    console.log('page', page);
    console.log('previous page', previousPage)
    if (page === previousPage) {
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/sponsorships?page=${page}&size=${LIMIT}`
      );
      const postsData = response.data.records;
      setDonations((prevItems) => [...prevItems, ...postsData]);
      setTotalDonations(response.data.total);
      setPreviousPage(page);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const updateDonations = () => {
    console.log('Update Donations');
    setPage(page + 1);
  }


  useEffect(() => {
    getPosts();
  }, [page]);

  const getUserSponsorships = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/sponsorships/user/${profile._id}`
      );
      setUserDonations(response.data.sponsorships);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getUserSponsorships();
  }, []);
  console.log('admin',admin)


  return (
    <div style={{ width: '60%', height: '120vh' }}>
      <DonSpon title={title} icon={icon} />
      <Routes>
        <Route path="/" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='sponsorships' create={admin}/>} />
        <Route path="/my-sponsorship-requests" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='sponsorships' create={admin}/>} />
        <Route path="/:_id" element={<IndividualDonSpon />} />
        <Route path="/create" element={<DonSponRequest name='sponsorship' />} />
        <Route path="/edit/:_id" element={<DonSponRequest name='sponsorship' edit={true} />} />
      </Routes>
      <Routes>
        {admin ? (
          <Route path="/my-sponsorship-requests" element={<BrowseDonations donSpon={donations} name='sponsorships' />} />
        ) : (
          <Route path="/my-sponsorship-requests" element={<BrowseDonations donSpon={userDonations} name='sponsorships' />} />
        )}
        <Route path="/" element={<BrowseDonations donSpon={donations} name='sponsorships' updateDonations={updateDonations} totalDonations={totalDonations} limit={LIMIT} page={page} loading={loading} />} />
      </Routes>
    </div>
  )
}

export default Sponsorships;