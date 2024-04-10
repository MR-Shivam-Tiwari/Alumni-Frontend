import { useState } from 'react';
import './loginPage.css';
import bhu from '../../images/bhu.png';
import welcome from '../../images/bhuUni.jpg';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { login } from '../../store/userSlice';
import { updateProfile,setAdmin } from "../../store/profileSlice";

const LoginPage = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookie, setCookie] = useCookies(["token"]);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);
  const profile = useSelector((state)=> state.profile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentDate = new Date();
      const response = await fetch('http://localhost:5000/alumni/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
      const responseData = await response.json();
  
      handleLogin();
      
      const { token, alumni } = responseData;
      dispatch(updateProfile(alumni))
      setCookie("token", token , { path: "/" });
      if(alumni.profileLevel===0){
        console.log("level zero")
        dispatch(setAdmin(true));
      }
      
      if (alumni.expirationDate && new Date(alumni.expirationDate) < currentDate) {
        toast.error("Your account has expired. Contact admin to recover account");
        setLoading(false);
        return; 
      }
  
      toast.success("Logged in successfully!");
      setLoading(false);
      navigateTo("/");
      } else {
        const errorData = await response.json();
        console.error('Login failed',errorData);
        toast.error(errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false);
      
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className='login-left'>
        <div style={{ width: '70%', paddingTop: '50px', position: 'relative' }}>
          <img src={bhu} alt='' width='250px' height='70px' />
          <p style={{ fontSize: '40px', fontWeight: '600', marginTop: '60px' }}>Connect with friends!</p>
          <p style={{ fontSize: '18px' }}>Share what's new and life moments with your friends</p>
          <div className='login-left-welcome'>
            <img src={welcome} alt='' width='400vw' height='400vh' style={{ aspectRatio: '1', width: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
      <div className='login-right'>
        <div style={{ position: 'relative', height: '100%', width: '70%', paddingTop: '75px' }}>
          <p style={{ color: '#174873', fontSize: '44px', fontWeight: '700' }}>BHU Alumni Association</p>
          <p style={{ color: '#174873', fontSize: '44px', fontWeight: '600' }}>Welcome Back!</p>
          <p>Create your Alumni Portal Account!</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='text' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>

            <div className='login-remember-forgot'>
              <Form.Group className='mb-3' controlId='formBasicCheckbox' style={{ marginBottom: '0px' }}>
                <Form.Check type='checkbox' label='Remember this device' style={{marginTop: '0px'}}/>
              </Form.Group>
              <p style={{ color: '#174873',marginBottom: '0px' }}>Forgot Password?</p>
            </div>

            <Button variant='primary' type='submit' style={{ width: '100%', backgroundColor: '#174873' }}>
              {loading? 'Logging in...' : 'Login'}
            </Button>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginTop: '20px' }}>
              Don't have an account? <a href='/register' style={{ textDecoration: 'none', color: ' #174873' }}>Register</a>
            </p>
          </div>
          <div style={{ position: 'absolute', bottom: '0',display: 'none' }}>
            <ul style={{ display: 'flex', justifyContent: 'space-around' }}>
              <li>2023 Alumni Portal</li>
              <li>Terms Of Use</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
              <li>About</li>
              <li>Blog</li>
              <li>Language</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
