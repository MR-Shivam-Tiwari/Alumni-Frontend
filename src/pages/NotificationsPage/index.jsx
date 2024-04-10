import PageTitle from "../../components/PageTitle";
import PageSubTitle from "../../components/PageSubTitle";
import { Route, Routes } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import {NotificationsP} from "../../components/NotificationsP";
import { NotificationsDeclined } from "../../components/NotificationsDeclined";
import { useSelector } from "react-redux";

const NotificationsPage=()=>{
    const title = "Notifications";
    const icon = <IoIosNotifications style={{ color: '#174873' }} />;
    const buttontext1 = 'All Notifications';
    let buttontext2 = '';
    const buttontext1Link = "/notifications";
    const buttontext2Link = "/notifications/declined";
    const profile = useSelector((state)=> state.profile);
    if (profile.profileLevel === 0 || profile.profileLevel === 1) {
      buttontext2 = 'Declined';
    }
    return(
        <>
        <div style={{ width: '60%', paddingTop: '20px' }}>
      <Routes>
        <Route path="/" element={<PageTitle title={title} icon={icon} />} />
        <Route path="/declined" element={<PageTitle title={title} icon={icon} />} />
      </Routes>
      <Routes>
          <Route path="/" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='notifications' create={false}/>} />
          <Route path="/declined" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} name='notifications' create={false}/>} />
       
      </Routes>
      <Routes>
       
          <Route path="/" element={<NotificationsP />}/>
          {/* <Route path="/declined" element={<NotificationsDeclined />}/> */}
          {(profile.profileLevel === 0 || profile.profileLevel === 1) && (
            <Route path="/declined" element={<NotificationsDeclined />}/>
          )}
          {!(profile.profileLevel === 0 || profile.profileLevel === 1) && (
            <Route path="/declined" element={<div>Wrong Route.Please Go Back</div>} />
          )}
      </Routes>
      </div>
      </>

    )
}


export default NotificationsPage;