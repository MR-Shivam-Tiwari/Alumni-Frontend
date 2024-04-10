import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import './commentSection.css';
import pic from "../../images/odA9sNLrE86.jpg";
import { useSelector } from 'react-redux';


const CommentSection = ({ comments, entityId, entityType, onCommentSubmit, onDeleteComment }) => {
  const [content, setContent] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [reply, setReply] = useState('');
  const [cookie] = useCookies(['access_token']);
  const foruumId = '64f5ce5db9cddde68ba64b75';
  const profile = useSelector((state)=> state.profile)
  console.log('entity id',entityId)

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/${entityType}/${entityId}/comments`, {
        userId: profile._id,
        content: content,
        userName: profile.firstName,
        parentCommentId: null,
      });
      const postId= response.data._id;
      setContent('');
      onCommentSubmit(postId); // Trigger a callback to refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response= await axios.delete(`http://localhost:5000/${entityType}/${entityId}/comments/${commentId}`);
      const postId = response.data._id;
      onDeleteComment(postId); // Trigger a callback to refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const renderComments = (commentsArray) => {
    if (!commentsArray || commentsArray.length === 0) {
      return null;
    }

    return (
      <ul className="comment-list">
        {commentsArray.map((comment) => (
          <li key={comment._id}>
            <div className="comment">
            <div style={{display:'flex',flexDirection:'row',gap:'10px'}}><img src={pic} style={{width:'40px',height:'40px', borderRadius:'50%'}}/>
              <p style={{margin:'0px',fontWeight:'400',backgroundColor:'#E6E6FA',padding:'10px',borderRadius:'10px'}}>{comment.content}</p></div>
              <p style={{fontStyle:'normal',fontSize:'16px',fontWeight:'500'}}>By : {comment.userName}</p>
              <div className="comment-buttons">
                <button onClick={() => handleCommentReply(comment._id)}>Reply</button>
                <button onClick={() => handleCommentDelete(comment._id)}>Delete</button>
              </div>
              {replyToCommentId === comment._id && (
                <div className="reply-form">
                  <textarea
                    placeholder="Reply to this comment"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)} style={{borderRadius:'10px',padding:"5px",width:'90%',border:'none'}}
                  />
                  <button onClick={() => handleReplySubmit(comment._id)} style={{borderRadius:'10px',fontSize: '14px',fonttyle: 'italic',fontFamily: 'sans-serif',margin: '10px 10px',padding:'8px',backgroundColor: '#174873',color:'white',border: '#888 solid 1px'}}>Submit Reply</button>
                </div>
              )}
              {renderComments(comment.comments)}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const handleCommentReply = (commentId) => {
    setReplyToCommentId(commentId);
    setContent('');
  };

  const handleReplySubmit = async (parentCommentId) => {
    try {
      const response=await axios.post(`http://localhost:5000/${entityType}/${entityId}/comments`, {
        content: reply,
        userName: profile.firstName,
        parentCommentId: parentCommentId,
      });
      const postId= response.data._id;
      setReply('');
      setReplyToCommentId(null);
      onCommentSubmit(postId); // Trigger a callback to refresh comments
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div>
      <div className="comment-box">
        <div><img src={pic} style={{width:'60px',height:'55px', borderRadius:'55%'}}/></div>
        <textarea id='textCommentSection'
          placeholder="Add a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        </div>
        
        <div style={{display:'flex',justifyContent:'end', textAlign:'center'}}>
        <button id='submitCommentSection' onClick={handleCommentSubmit}>Comment</button>
        </div>
      {renderComments(comments)}
    </div>
  );
};

export default CommentSection;
