import React, { useState } from 'react';
import axios from 'axios';
import "./registerpage.css";
import "../LoginPage/loginPage.css"
import backgroundPic from "../../images/imgb.jpg";
import pic from "../../images/bhuUni.jpg";
import logo from "../../images/bhu.png";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { RegisterForm } from '../../components/RegisterForm';

const RegisterPage = ({handleLogin}) => {
  const navigateTo = useNavigate();
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    accept: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('formData', formData);
      const response = await axios.post('http://localhost:5000/alumni/register', formData);

      console.log('Registration successful!', response.data);
      toast.success("User Registered successfully!");
      navigateTo('/');
      setLoading(false);

    } catch (error) {
      console.error('Registration failed!', error.response.data);
      toast.error(error.response.data);
      setLoading(false);

    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 1; i >= currentYear - 100; i--) {
      years.push(`${i}-${i + 1}`);
    }
    return years;
  };

  return (
    <>
      <div className='main'>
      <div className='login-left'>
        <div style={{ width: '70%', paddingTop: '50px', position: 'relative' }}>
          <img src={logo} alt='' width='250px' height='70px' />
          <p style={{ fontSize: '40px', fontWeight: '600', marginTop: '60px' }}>Connect with friends!</p>
          <p style={{ fontSize: '18px' }}>Share what's new and life moments with your friends</p>
          <div className='login-left-welcome'>
            <img src={pic} alt='' width='400vw' height='400vh' style={{ aspectRatio: '1', width: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
        <div className='right'>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '30px' }}>
            <form id='register' onSubmit={handleSubmit} method='post' style={{ width: '70%' }}>
              <p style={{ fontSize: '44px', fontWeight: '700', color: '#174873' }}>BHU Alumni Association</p>
              <p style={{ fontSize: '44px', fontWeight: '600', color: '#174873' }}>Register</p>
              <p style={{ fontSize: '16px' }}>Create your Alumni Portal Account!</p>
              <div className='form-fields'>
                <label>First Name</label><br />
                <input type='text' name='firstName' id='firstName' onChange={handleChange} required />
              </div>
              <div className='form-fields'>
                <label>Last Name</label><br />
                <input type='text' name='lastName' id='lastName' onChange={handleChange} required />
              </div>
              <div className='form-fields'>
                <label>E-mail address</label><br />
                <input type='text' name='email' id='email' onChange={handleChange} required />
              </div>
              <div className='form-fields'>
                <label>Password</label><br />
                <input type='password' name='password' id='password' onChange={handleChange} required />
              </div>
              <div className='form-fields'>
                <label>Confirm Password</label><br />
                <input type='password' name='confirmPassword' id='confirmPassword' onChange={handleChange} required />
              </div>
              <div className='form-fields'>
                <label>Gender</label><br />
                <select name='gender' id='gender' onChange={handleChange} required>
                  <option value='' disabled selected>Select Gender</option>
                  <option value='Other'>Other</option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select>
              </div>
              <div className='form-fields'>
                <label>Department</label><br />
                <select name='department' id='department' onChange={handleChange} required>
                  <option value='' disabled selected>Select Department</option>
                  <option value='Agricultural Engineering'>Agricultural Engineering</option>
                  <option value='Gastroenterology'>Gastroenterology</option>
                  <option value='Indian languages'>Indian languages</option>
                  <option value='Neurosurgery'>Neurosurgery</option>
                  <option value='Vocal Music'>Vocal Music</option>
                </select>
              </div>
              <div className='form-fields'>
                <label>Batch</label><br />
                <select name='batch' id='batch' onChange={handleChange} required>
                  <option value='' disabled selected>Select Batch</option>
                  {generateYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className='check'>
                <input type='checkbox' name='accept' id='accept' onChange={handleChange} required />
                <p style={{ marginBottom: '0px' }}> By creating your account, you agree to our Privacy Policy</p>
              </div>
              <div className='button'>
                <div className='login-btn'>
                  <button type='submit' id='btn' name='btn'>{loading? 'Registering...' : "Let's go"}</button>
                </div>
                <div>
                  <p>Already have an account? <a href='/' style={{ textDecoration: 'none', color: '#174873' }}>Login</a></p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
