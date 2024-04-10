import React, { useState} from 'react';
import Chathead from '../Chathead';
import './chatbox.css'
import Chat from '../Chat';
import { HiUserGroup } from "react-icons/hi2";
import { PiUserListFill } from "react-icons/pi";


import { BiSolidImageAlt } from "react-icons/bi";
import { Diversity1Rounded } from '@mui/icons-material';
import { set } from 'date-fns';
import { FaFileAlt } from "react-icons/fa";
import { MdMic } from "react-icons/md";
import { AiOutlineFileGif } from "react-icons/ai";
import { VscColorMode } from "react-icons/vsc";
import { CiFaceSmile } from "react-icons/ci";


const Chatbox = () => {

    const [isgroupsOpen, setgroupsOpen] = useState(false);
    const opengroups = () =>{
      setgroupsOpen(true);
    }
    const closegroups = () =>{
      setgroupsOpen(false);
    }
 
  const [isHovered, setIsHovered] = useState(false);
    const hoveruser = () =>{
        setIsHovered(true);
    }

    const nohoveruser = () =>{
      setIsHovered(false);
    }
       
    return (
    <>
    <div className='chat' style={{zIndex: '4'}}>
        <div className='chat1'>
            <div className='chat-box'>
             <Chathead />    
            </div>
            <div style={{display:'flex',justifyContent:'center',fontSize:'20px',marginTop:'15px'}}>
              <div  style={{position:'relative'}}>
                <button  onMouseEnter={opengroups}
                         onMouseLeave={closegroups} 
                         style={{padding:'5px 15px',marginRight:'10px',borderRadius:'25%',border:'none'}}><PiUserListFill style={{fontSize:'20px',color:'#174873', borderRadius:'25%'}} />
                </button>
                {isgroupsOpen && (
                  <div style={{position:'absolute'}}>
                    <ul>
                      <li style={{listStyleType:'none'}} ><p style={{border:"1px solid black",fontSize:'14px',padding:'2px'}}>Users</p></li>
                    </ul>
                  </div>
                )}        
              </div>
              <div style={{position:'relative'}}> 
              <button style={{padding:'5px 15px',borderRadius:'25%',border:'none'}}><HiUserGroup style={{fontSize:'20px',color:'#D3D3D3',borderRadius:'25%'}} 
                onMouseEnter={hoveruser}
                onMouseLeave={nohoveruser}/> 
              </button>
                {isHovered &&
                 <div style={{position:'absolute',}}>
                    <p style={{border:'1px solid black',fontSize:'14px',padding:'2px'}}>Groups</p>
                  </div>
                 }
                </div>  
            </div>
            <div className='search-users'>
                <input type='text' name='name' placeholder='Search for users'/>
            </div>
            <div>
              <Chat />
            </div>
        </div>
    </div>
    </>
  )
}

export default Chatbox;
