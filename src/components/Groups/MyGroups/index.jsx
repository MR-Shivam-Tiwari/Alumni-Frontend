import DisplayPost from "../../DisplayPost";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
const MyGroups = () => {
  const title = 'MyGroups';
  const [groups, setGroups] = useState([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const [loading, setLoading] = useState(false)
  const LIMIT = 4;
  const profile = useSelector((state)=> state.profile);
  let [page, setPage] = useState(1);
  let [previousPage, setPreviousPage] = useState(0);
  // const getGroups = async () => {
  //   setLoading(true)
  //   console.log('page', page);
  //   console.log('previous page', previousPage)
  //   if (page === previousPage) {
  //     return;
  //   }
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/groups?page=${page}&size=${LIMIT}`
  //     );
  //     const postsData = response.data.records;
  //     setGroups((prevItems) => [...prevItems, ...postsData]);
  //     setTotalGroups(response.data.total);
  //     setPreviousPage(page);
  //     setLoading(false)
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //   }
  // };

  const getGroups = async () => {
    setLoading(true)
    console.log('page', page);
    console.log('previous page', previousPage)
    if (page === previousPage) {
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/groups/user/${profile._id}`
      );
      const postsData = response.data.groups;
      setGroups(postsData);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };


  useEffect(() => {
    getGroups();
  }, [page]);
  const handleLoadMore = () => {
    console.log('Update Donations');
    setPage(page + 1);
  }
  return (
    <div style={{ paddingBottom: '3vh' }}>

      <DisplayPost title={title} groups={groups} loading={loading}/>
      {page < totalGroups / LIMIT && (
            <div style={{textAlign: 'center', marginTop: '3vh'}}>
            <button className="load-more-button" onClick={handleLoadMore}>
                Load More
            </button>
            </div>
        )}
    </div>
  )
}
export default MyGroups;