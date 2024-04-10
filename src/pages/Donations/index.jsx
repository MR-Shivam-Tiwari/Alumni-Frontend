import './donations.css'
import '../../components/DonSpon'
import DonSpon from '../../components/DonSpon';
import { LuHeartHandshake } from 'react-icons/lu';
import PageSubTitle from '../../components/PageSubTitle';
import { Route, Routes } from "react-router-dom";
import MyDonationRequests from '../../components/MyDonationRequests';
import BrowseDonations from '../../components/BrowseDonations';
import { useState, useEffect } from 'react';
import IndividualDonSpon from '../../components/IndividualDonSpon';
import DonSponRequest from '../../components/DonSponRequest';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Donations = () => {
  const title = 'Donations';
  const icon = <LuHeartHandshake />;
  const buttontext1 = 'Browse Businesses';
  const buttontext2 = 'My Business Requests';
  const buttontext1Link = "/donations";
  const buttontext2Link = "/donations/my-donation-requests";
  const [donations, setDonations] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [loading, setLoading] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const profile = useSelector((state) => state.profile);
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
        `https://alumni-backend-chi.vercel.app/donations?page=${page}&size=${LIMIT}`
      );
      const postsData = response.data.records;
      setDonations((prevItems) => [...prevItems, ...postsData]);
      setTotalDonations(response.data.total);
      setPreviousPage(page);
      setLoading(false)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const updateDonations = () => {
    setIsLoading(true)
    setPage(page + 1);
  }


  useEffect(() => {
    getPosts();
  }, [page]);

  const getUserDonations = async () => {
    try {
      const response = await axios.get(
        `https://alumni-backend-chi.vercel.app/donations/user/${profile._id}`
      );
      setUserDonations(response.data.donations);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getUserDonations();
  }, []);



  return (
    <div style={{ width: '60%', height: '120vh' }}>
      <DonSpon title='Business Connect' icon={icon} />
      <Routes>
        <Route path="/" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='donations' create={admin}/>} />
        <Route path="/my-donation-requests" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='donations' create={admin}/>} />
        <Route path="/:_id" element={<IndividualDonSpon />} />
        <Route path="/create" element={<DonSponRequest name='donation' />} />
        <Route path="/edit/:_id" element={<DonSponRequest name='donation' edit={true} />} />
      </Routes>
      <Routes>
        {admin ? (
          <Route path="/my-donation-requests" element={<BrowseDonations donSpon={donations} name='donations' />} />
        ) : (
          <Route path="/my-donation-requests" element={<BrowseDonations donSpon={userDonations} name='donations' />} />
        )}
        <Route path="/" element={<BrowseDonations donSpon={donations} name='donations' updateDonations={updateDonations} totalDonations={totalDonations} limit={LIMIT} page={page} loading={loading} isLoading={isLoading}/>} />
      </Routes>
    </div>
  )
}

export default Donations;