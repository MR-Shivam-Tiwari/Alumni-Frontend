import PageTitle from "../../components/PageTitle";
import PageSubTitle from "../../components/PageSubTitle";
import { BsGridFill } from 'react-icons/bs';
import { Route, Routes } from "react-router-dom";
import SuggestedGroups from "../../components/Groups/SuggestedGroups";
import MyGroups from "../../components/Groups/MyGroups";
import JoinedGroups from "../../components/Groups/JoinedGroups";
import DonSponRequest from "../../components/DonSponRequest";
import IndividualGroup from "../../components/Groups/IndividualGroup";
import { useSelector } from 'react-redux';
import AllGroups from "../../components/Groups/AllGroups";


const Groups = () => {
  const profile = useSelector((state) => state.profile);
  const title = "Groups";
  const icon = <BsGridFill style={{ color: '#174873' }} />
  const buttontext1 = 'My Groups';
  const buttontext2 = 'Suggested Groups';
  const buttontext3 = 'Joined Groups';
  const buttontext1Link = "/groups";
  const buttontext2Link = "/groups/suggested-groups";
  const buttontext3Link = `/groups/${profile._id}/joined-groups`;
  

  let admin;
  if (profile.profileLevel === 0 || profile.profileLevel === 1) {
    admin = true;
  }




  return (
    <div style={{ width: '60%', paddingTop: '20px' }}>
      <Routes>
        <Route path="/" element={<PageTitle title={title} icon={icon} />} />
        <Route path="/:_id/*" element={<IndividualGroup />} />
        <Route path="/suggested-groups" element={<PageTitle title={title} icon={icon} />} />
        <Route path="/:id/joined-groups" element={<PageTitle title={title} icon={icon} />} />
        <Route path="/create" element={<PageTitle title={title} icon={icon} />} />
        <Route path="/edit/:_id" element={<PageTitle title={title} icon={icon} />} />
      </Routes>
      <Routes>
        {admin ? (
          <Route path="/" element={<PageSubTitle buttontext1='All Groups' name='groups' create={true}/>} />
        ) : (
          <Route path="/" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} name='groups' create={false}/>} />
        )}
        {admin ? (
          <Route path="/suggested-groups" element={<>Wrong Route.Please Go Back</>} />
        ) : (
          <Route path="/suggested-groups" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} name='groups' create={false}/>} />
        )}
        {admin ? (
          <Route path="/:id/joined-groups" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} name='groups' create={true}/>} />
        ) : (
          <Route path="/:id/joined-groups" element={<PageSubTitle buttontext1={buttontext1} buttontext2={buttontext2} buttontext3={buttontext3} buttontext1Link={buttontext1Link} buttontext2Link={buttontext2Link} buttontext3Link={buttontext3Link} name='groups' create={false}/>} />
        )}
        <Route path="/create" element={<DonSponRequest name='group' edit={false} />} />
        <Route path="/edit/:_id" element={<DonSponRequest name='group' edit={true} />} />
      </Routes>
      <Routes>
      {admin ? (
          <Route path="/suggested-groups" element={<></>} />
        ) : (
          <Route path="/suggested-groups" element={<SuggestedGroups />} />
        )}
        {/* <Route path="/suggested-groups" element={<SuggestedGroups />} /> */}
        <Route path="/:id/joined-groups" element={<JoinedGroups />} />
        {admin ? (
          <Route path="/" element={<AllGroups />} />
        ) : (
          <Route path="/" element={<MyGroups />} />
        )}
      </Routes>
    </div>
  )
}

export default Groups;
