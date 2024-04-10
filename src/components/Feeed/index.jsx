import React, { useState, useEffect, useRef } from 'react';
import CreatePost1 from '../CreatePost1';
import Post from '../Post';
import axios from 'axios';
import './feed.scss';
import { toast } from "react-toastify";
import CommentSection from '../CommentSection';
import JobIntDisplay from '../JobsInt/JobIntDispay';
import { useSelector } from 'react-redux';
import { DisplayNews } from '../DisplayNews';
import { dotPulse } from 'ldrs'

dotPulse.register()




function Feed({ photoUrl, username, showCreatePost, entityId, entityType, showDeleteButton, admin }) {
  const [posts, setPosts] = useState([]);
  const profile = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const activePageRef = useRef(1);
  const isFetchingRef = useRef(false);
  let lastFetchedPageRef = useRef(0);
  console.log("Entity type1", entityType)
  const [jobs, setJobs] = useState([]);


  const getJobs = () => {

  }

  const LIMIT = 4;

  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      console.log('scrolling')
      if (container) {
        const { scrollTop, clientHeight, scrollHeight } = container;
        if (
          scrollTop + clientHeight >= scrollHeight - 10 &&
          !loading &&
          isFetchingRef.current &&
          activePageRef.current <= totalPosts / LIMIT
        ) {
          isFetchingRef.current = true;
          activePageRef.current++;
          if (posts.length < totalPosts) {
            getPosts(activePageRef.current);
          }
        }
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);



  useEffect(() => {
    console.log("useeffect");
    console.log('active and last', activePageRef.current, lastFetchedPageRef.current);
    //lastFetchedPageRef.current++;
    if (activePageRef.current !== lastFetchedPageRef.current) {
      getPosts(activePageRef.current);
    }
  }, []);


  const handleDeletePost = () => {

    getPosts(activePageRef.current);
    toast.success('Deleted successfully!');
    window.location.reload();


  }

  const handleLikes = async (entityId) => {
    try {
      const response = await axios.get(`http://localhost:5000/${entityType}/${entityId}`);
      const updatedPost = response.data;


      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post._id === entityId) {
            return updatedPost;
          }
          return post;
        });
      });
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  }



  const handleNewPost = () => {
    toast.success('Posted successfully!');
    window.location.reload();
  };

  const refreshComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/${entityType}/${postId}`);
      const updatedPost = response.data;
      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post._id === postId) {
            return updatedPost;
          }
          return post;
        });
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const getPosts = async (page) => {
    setLoading(true);
    isFetchingRef.current = false;
    console.log("Getting posts/news")
    try {
      const response = await axios.get(
        `http://localhost:5000/${entityType}?page=${page}&size=${LIMIT}`
      );
      const postsData = response.data.records;
      setPosts((prevItems) => [...prevItems, ...postsData]);
      setTotalPosts(response.data.total);
      lastFetchedPageRef.current = page;
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    isFetchingRef.current = true;
    setLoading(false);
  };

  return (
    <div className='feed'>
      {showCreatePost && <CreatePost1 photoUrl={photoUrl} username={username} onNewPost={handleNewPost} entityType={entityType} />}
      <div className='infiniteScroll' ref={scrollContainerRef} style={{ height: "100%", marginTop: '10px', overflowY: "auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {posts.map((post, index) => {
          if (post.type === 'Post') {
            return (
              <div key={post._id} className="post-box">
                <Post
                  userId={post.userId}
                  postId={post._id}
                  username={post.firstName}
                  text={post.description}
                  image={post.picturePath}
                  video={post.videoPath}
                  timestamp={post.createdAt}
                  likes={post.likes}
                  entityType={entityType}
                  admin={admin}
                  showDeleteButton={showDeleteButton}
                  handleLikes={handleLikes}
                  onDeletePost={() => handleDeletePost(post._id)}
                />
                {console.log("entityType", entityType)}
                {(entityType === 'posts' || entityType === 'forums') && (<CommentSection entityId={post._id} entityType="posts" onCommentSubmit={refreshComments}
                  onDeleteComment={refreshComments} comments={post ? post.comments : null} />)}
              </div>
            );
          } else if (post.type === 'Job') {
            return (
              <div key={post._id} className="job-box" style={{ width: '100%' }}>
                <JobIntDisplay
                  jobId={post._id}
                  picture={post.coverImage}
                  jobTitle={post.jobTitle}
                  location={post.location}
                  salaryMin={post.salaryMin}
                  salaryMax={post.salaryMax}
                  currency={post.currency}
                  jobType={post.jobType}
                  category={post.category}
                  description={post.description}
                />
              </div>
            );
          } else if (entityType === 'news') {
            return (
              <div key={post._id} style={{ width: '100%' }}>
                <DisplayNews
                  description={post.description}
                  createdAt={post.createdAt}
                  picturePath={post.picturePath}
                  videoPath={post.videoPath}
                  department={post.department}
                />
              </div>
            )

          }
          return null;
        })}
        {loading && <div>
          <l-dot-pulse
            size="35"
            speed="1.0"
            color="#b3b4b5"
          ></l-dot-pulse></div>}
        {totalPosts != 0 && activePageRef.current >= totalPosts / LIMIT && (
          <p>You have seen all the {entityType}</p>
        )}
      </div>
    </div>
  );


}

export default Feed;