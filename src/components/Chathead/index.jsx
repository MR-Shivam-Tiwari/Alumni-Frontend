import React,{useState} from 'react'
import "./chathead.css"
import { FaUserGroup } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi2";
import { RiSettings3Fill } from "react-icons/ri";
const Chathead = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const [isPopuptext, setIspopuptext] = useState(false);
  const openpopuptext = () =>{
    setIspopuptext(!isPopuptext);
  }
  const closepopuptext = () =>{
    setIspopuptext(false);
  }
  return (
    <div className='chat-head'>
      <div>
        <p style={{margin:'0px',fontWeight:'bold',fontSize:'20px',color:'#C0C0C0'}}>Chat</p>
                </div>
                  <div>
                    <button onClick={openPopup} style={{backgroundColor:'#D3D3D3',marginRight:'10px',borderRadius:'50px',padding:'1px 5px',border:'none'}}><HiUsers style={{fontSize:'20px'}}/></button>
                      {isPopupOpen && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                              <span className="close-btn" onClick={closePopup} style={{fontSize:'25px'}}>
                                 &times;
                              </span>
                              <div className="group-head"style={{backgroundColor:'#174873',width:'100%'}}>                          
                                <FaUserGroup /><h2 style={{color:'white'}}>Create a Group chat</h2>
                              </div>
                              <div className='field-input' style={{position:'relative',width:'90%'}}>
                                 <div>
                                    <label>Name</label><br/>
                                    <input id="group_name" name="group_name" type="text" max="50" fdprocessedid="z0z2eh"></input>
                                  </div>
                                  <div>
                                    <label> Add participant(0)</label><br/>
                                    <input id="add_parts" type="text" onkeydown="Wo_GetGChatParticipants(this.value)" fdprocessedid="jln4"></input>
                                  </div>
                                  <div>
                                    <label>Image</label><br/>
                                    <div >
                                      <div className='bg-img' style={{width:'95%',borderRadius:'10px'}}>
                                         <input type='file' name='name' style={{margin:'0px'}}/>
                                      </div>
                                    </div>
                                    <div className='button-btn'>
                                      <button>Create</button>
                                    </div>
                                 </div>
                              </div>
                            </div>
                         </div>
                      )}
                    <button className='popup-button' onBlur={() => closepopuptext()}
                      onClick={() => openpopuptext()} style={{backgroundColor:'#D3D3D3',borderRadius:'50px',padding:'1px 5px',border:'none'}}><RiSettings3Fill style={{fontSize:'20px'}}/>
                    </button>
                    {isPopuptext && (
                      <div className='popup' style={{backgroundColor:'#DCDCDC',padding:'20px',borderRadius:'10px',position:'absolute',zIndex: '1'}}>
                        <ul style={{padding:'0px 10px',margin:'0px',listStyleType:'none'}}>
                          <li style={{padding:'5px 0px'}}>Online</li>
                          <li style={{padding:'5px 0px'}}>Offline</li>
                        </ul>
                      </div>)}
                </div>
    </div>
  )
}

export default Chathead
