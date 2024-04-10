import React from 'react';
import { ThumbUpRounded, ChatBubbleOutlineRounded, NearMeRounded, DeleteRounded } from '@mui/icons-material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { Avatar, TextField, IconButton, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import './Post.scss';
import { useSelector } from 'react-redux';

function Post({ userId,postId, profilePic, username, text, timestamp, image, video, likes, handleLikes, handleComments, className, onDeletePost, entityType ,showDeleteButton}) {
  const [isliked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [cookie, setCookie] = useCookies(['access_token']);

  
  const [loading, setLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const profile = useSelector((state) => state.profile);
  const loggedInUserId = profile._id;
  let admin;
  if(profile.profileLevel===0){
    admin = true;
  }

  const handlePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        try {
          await videoRef.current.pause();
          setIsPlaying(false);
        } catch (error) {
          console.error('Error playing video:', error);
        }
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }

  };


    useEffect(() => {
      if (loggedInUserId && postId) {
        const postLiked = likes.some((like) => like.userId === loggedInUserId);
        setLiked(postLiked);
      }
    }, [likes, loggedInUserId, postId]);
  


  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/posts/${postId}/comments`);
      const fetchedComments = response.data.comments;
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };


  const handleLike = async (e) => {
    setLiked(!isliked);
    try {

      const response = await axios.patch(
        `http://localhost:5000/posts/${postId}/likes`,
        {
          userId: loggedInUserId,
          userName: username, 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const id = await response.data._id;
      handleLikes(id);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };


  const handleDeletePost = async (userId) => {
    if( userId === profile._id){
    try {
      await axios.delete(`http://localhost:5000/${entityType}/${postId}`);
      onDeletePost(postId); 
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
    else{
      console.log("Cannot Delete")
    }
  };
  const formatCreatedAt = (timestamp) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const timeString = new Date(timestamp).toLocaleTimeString(undefined, options);
    const dateString = new Date(timestamp).toLocaleDateString();
  
    return `${dateString} ${timeString}`;
  };


  
  return (
    <div className={`post ${className}`}>
      {loading ? (<div> Loading...</div>) : (<>
        <div className='top'>
          <Avatar src={profilePic} />
          <div className='info'>
            <h4>{username}</h4>
            <span>{formatCreatedAt(timestamp)}</span>
          </div>
          {(admin || userId===profile._id )&& ( 
            <IconButton onClick={()=> handleDeletePost(userId)} className='delete-button'>
              <DeleteRounded />
            </IconButton>
          )}
        </div>
        {text && (
          <div className='texxt'>
            <p>{text}</p>
          </div>
        )}
        {image && (
          <div className='image'>
            <img src={image} alt='Post Image' />
          </div>
        )}
        {video && (
          <div className='video'>
            <video
              ref={videoRef}
              autoPlay={isPlaying}
              preload="auto"
              controls={false} 
              onClick={handlePlay}
            >
              <source src={video.videoPath} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
            <div className={`play-button ${isPlaying ? '' : ''}`} onClick={handlePlay}>
              <PlayCircleOutlineRoundedIcon fontSize='large' />
            </div>
          </div>
        )}
        {console.log('entity type1',entityType)}
        {entityType === 'posts' && ( 
          <div className='bottomAction'>
            <div className='action' onClick={handleLike}>
              <ThumbUpRounded className={`postAction ${isliked ? 'blue' : 'grey'}`} />
              <h4>Like</h4>
            </div>
        
            <div className='action'>
              <ChatBubbleOutlineRounded className={`postAction grey`} />
              <h4>Comment</h4>
            </div>
            <div className='action'>
              <NearMeRounded className={`postAction grey`} />
              <h4>Share</h4>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

const iconList = [
  {
    Icon: ThumbUpRounded,
    title: 'Like',
    color: 'grey'
  },
  {
    Icon: ChatBubbleOutlineRounded,
    title: 'Comment',
    color: 'grey'
  },
  {
    Icon: NearMeRounded,
    title: 'Share',
    color: 'grey'
  }
];

export default Post;
