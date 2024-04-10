import React, { useState } from 'react';
import CKeditor from "../../CKeditor/CKeditor.jsx";
import "./CreateForum.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';

const CreateForum = () => {
  const [newForum, setNewForum] = useState({ title: "", description: "", picture: "", type: "Public" });
  const [editorValue, setEditorValue] = useState('');
  const navigateTo = useNavigate();
  const profile = useSelector((state) => state.profile);

  const handleTitleChange = (e) => {
    setNewForum({ ...newForum, title: e.target.value });
  };

  const handleEditorChange = (value) => {
    setNewForum({ ...newForum, description: value });
    setEditorValue(value);
  };

  const handleTypeChange = (e) => {
    setNewForum({ ...newForum, type: e.target.value });
  };

  const handleSave = async () => {
    try {
      const body = {
        userId: profile._id,
        title: newForum.title,
        picture: newForum.picture,
        description: newForum.description,
        type: newForum.type,
        department: profile.department
      };

      const response = await axios.post('http://localhost:5000/forums/createForum', body);

      console.log('Forum created:', response.data);
      toast.success("New Forum Created");
      navigateTo("/forums");
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  return (
    <div style={{ width: '60%' }}>
      <h1 style={{ textAlign: 'center', padding: '30px 0px', fontWeight: '600', backgroundColor: '#174873', margin: '0', color: 'white' }}>Create New Forum</h1>
      <div className='crt'>
        <div className='crt-forum'>
          <div>
            <p style={{ marginTop: '20px', fontSize: '30px', fontWeight: '500' }}> Title</p>
            <input type='text' name='name' placeholder='Forum title' style={{ height: '50px', marginTop: '15px', width: '100%', borderRadius: '5px' }} value={newForum.title} onChange={handleTitleChange} />
          </div>
          <div>
            <p style={{ fontSize: '30px', fontWeight: '500', margin: '15px 0px' }}>Type</p>
            <select value={newForum.type} onChange={handleTypeChange}>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div>
            <p style={{ fontSize: '30px', fontWeight: '500', margin: '15px 0px' }}>Description</p>
            <CKeditor value={editorValue} onChange={handleEditorChange} setNewForum={setNewForum} />
          </div>
          
          <div className='button1'>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateForum;
