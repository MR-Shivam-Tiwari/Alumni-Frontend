import React, { useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import { PostAction } from '../PostAction';
import {
  PhotoLibraryRoundedIcon,
  VideocamRoundedIcon,
  SendRoundedIcon
} from '../../YoutubeEmbed/icons.ts';
import axios from 'axios';
import './createPost.scss';
import PropTypes from 'prop-types';
//import { useCookies } from 'react-cookie';

function CreatePost({ photoUrl, username, onNewPost ,entityType}) {
  const [input, setInput] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  //const [cookie, setCookie] = useCookies(['access_token']);
  const [selectedFile, setSelectedFile] = useState('');
  //const token = cookie.access_token.token;
  const id = '64c4ed2ede6421691b5239dc';

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", id);
    formData.append("description", input);
    console.log('selected file',selectedFile)

    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        const reader = new window.FileReader();
        reader.onload = function (event) {
          const dataURL = event.target.result;
          formData.append("picturePath", dataURL);
          const formDataObject = {};


          for (let pair of formData.entries()) {
            const key = pair[0];
            const value = pair[1];


            formDataObject[key] = value;
            console.log("FORMDATAOBJECT:", formDataObject)
          }
          uploadImage(formDataObject);
        };
        reader.readAsDataURL(selectedFile);
      } else {

        formData.append("videoPath", selectedFile);
        const formDataObject = {};


        for (let pair of formData.entries()) {
          const key = pair[0];
          const value = pair[1];


          formDataObject[key] = value;
        }

        const currentDate = new Date();
        const folderName = currentDate.toISOString().split("T")[0];
        console.log("folder name:", folderName)

        uploadData(formDataObject, folderName);
      }
    } else {
      const formDataObject = {};


      for (let pair of formData.entries()) {
        const key = pair[0];
        const value = pair[1];


        formDataObject[key] = value;
        console.log("FORMDATAOBJECT:", formDataObject)
      }


      try {
        const response = await axios.post(
          `http://localhost:5000/${entityType}/create`,
          formDataObject,
        );
        const newPost = await response.data;
        onNewPost(newPost);
        setInput("");
        setImgUrl("");
      } catch (error) {
        console.error("Error posting:", error);
      }
    }
  };

  const uploadData = async (formDataObject, folderName) => {
    try {
      console.log("request body", formDataObject);
      const response = await axios.post(
        `http://localhost:5000/${entityType}/create?folder=${folderName}`,
        formDataObject,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newPost = await response.data;
      console.log(newPost);
      onNewPost(newPost);
      setInput("");
      setImgUrl("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const uploadImage = async (formDataObject) => {
    try {
      console.log("request body", formDataObject);
      const response = await axios.post(
        `http://localhost:5000/${entityType}/create`,
        formDataObject,
      );
      const newPost = await response.data;
      onNewPost(newPost);
      setInput("");
      setImgUrl("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error posting:", error);
    }
  };



  return (
    <div className='createPost'>
      <div className='top'>
        <Avatar src={photoUrl} />
        <form className='form' onSubmit={handleSubmit}>
          <input
            className='textInput'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`What's on your mind,?`}
            style={{color:"black"}}
          />
          <button type='submit' onClick={handleSubmit} className='post-button'>Post</button>
          <IconButton className='button' type='submit'>
            <SendRoundedIcon color='primary' />
          </IconButton>
        </form>
      </div>
      <div className='bottom'>
        {bottomIcon.map(({ Icon, title, color }, index) => (
          <label key={index}>
            <PostAction Icon={Icon} title={title} color={color} />
            <input
              type='file'
              accept={color === 'green' ? 'image/*' : 'video/*'}
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />
          </label>
        ))}

      </div>
    </div>
  );
}

CreatePost.propTypes = {
  photoUrl: PropTypes.string,
  username: PropTypes.string,
  onNewPost: PropTypes.func,
};

export default CreatePost;

const bottomIcon = [
  {
    Icon: PhotoLibraryRoundedIcon,
    title: 'Photo',
    color: 'green'
  },
  {
    Icon: VideocamRoundedIcon,
    title: 'Video',
    color: 'red'
  },
];