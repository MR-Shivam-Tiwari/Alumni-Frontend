import { useEffect, useRef, useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import Avatar from "./Avatar";
import './Chat.css';
import Logo from "./Logo";
import { useSelector } from "react-redux";
import { uniqBy } from "lodash";
import axios from "axios";
import { useCookies } from "react-cookie";
import Contact from "./Contact";
import { useNavigate } from "react-router-dom";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BASE_URL } from "../../config";

const Chat = () => {



  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('')
  const profile = useSelector((state) => state.profile);
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();
  const [cookie, setCookie] = useCookies('token');
  const [blockedByUsers, setBlockedByUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const navigateTo = useNavigate();
  console.log('base url',BASE_URL);



  useEffect(() => {
    fetchBlockedByUsers();
    fetchBlockedUsers();
    connectToWs();
  
    return () => {
      console.log('Unmounting Chat component...');
      disconnectFromWs();
    };
  }, [selectedUserId]);


  const fetchBlockedByUsers = async () => {
    try {
      const response = await fetch(`https://alumni-backend-chi.vercel.app/alumni/${profile._id}/blockedByUsers`);
      if (!response.ok) {
        throw new Error('Failed to fetch blocked by users');
      }
      const data = await response.json();
      setBlockedByUsers(data.blockedByUserIds); // Assuming the response contains an object with blockedByUserIds array
    } catch (error) {
      console.error('Error fetching blocked by users:', error.message);
      // Optionally handle the error here
    }
  };
  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch(`https://alumni-backend-chi.vercel.app/alumni/${profile._id}/blockedUsers`);
      if (!response.ok) {
        throw new Error('Failed to fetch blocked by users');
      }
      const data = await response.json();
      setBlockedUsers(data.blockedUsers);
    } catch (error) {
      console.error('Error fetching blocked by users:', error.message);

    }
  };

  console.log('blocked by1', blockedByUsers)
  console.log('blocked users1', blockedUsers)
  
  const connectToWs = () => {
    console.log('connecting')
    const ws = new WebSocket('ws://localhost:5000');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
  };
  
  const disconnectFromWs = () => {
    console.log('Disconnecting from WebSocket server...');
    if (ws) {
      ws.close();
      setWs(null);
      console.log('WebSocket connection closed');
    }
  };

  // const Lout = () => {
    
  //   disconnectFromWs();
  //   navigateTo("/");
  
  // };


  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    })
    setOnlinePeople(people);
  }
  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });
    if ('online' in messageData) {
      console.log('online')
      showOnlinePeople(messageData.online)
    } else if ('text' in messageData) {
      if(messageData.sender === selectedUserId){
        setMessages(prev => ([...prev, { ...messageData }]))
      }
      
    }
  }

  const sendMessage = (ev,file = null) => {
    if (ev){
      ev.preventDefault();
    }
    ws.send(JSON.stringify({

      recipient: selectedUserId,
      text: newMessageText,
      file,

    }));
    
    if(file){
      console.log('file',file)
      axios.get(`https://alumni-backend-chi.vercel.app/messages/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }).then(res => {
        console.log('message file',res.data)
        
        setMessages(prev => ([...prev, {
          file: file.name,
          sender: profile._id,
          recipient: selectedUserId,
          _id: Date.now(),
          createdAt: Date.now(),
        }]));
      })
    }else{
      setNewMessageText('');
      setMessages(prev => ([...prev, {
        text: newMessageText,
        sender: profile._id,
        recipient: selectedUserId,
        _id: Date.now(),
        createdAt: Date.now(),
      }]));
    }

  }

  const sendFile = (ev) => {
    console.log('file')
    const file = ev.target.files[0];
    const fileSizeMB = file.size / (1024 * 1024); 
    console.log('file size',file.size, fileSizeMB)
    if (fileSizeMB > 50) {
      
      console.log('File size exceeds 50MB. Please select a smaller file.');
      alert("File size exceeds 50MB. Please select a smaller file.")
      return;
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result.split(',')[1];
      sendMessage(null, {
        name: file.name,
        data: base64Data,
      });
    };
  };
  




  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }

  }, [messages])

  useEffect(() => {
    axios.get('https://alumni-backend-chi.vercel.app/alumni/all/allAlumni', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    }).then(res => {
      const offlinePeopleArray = res.data
        .filter(p => p._id !== profile._id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArray.forEach(p => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });

  }, [onlinePeople])

  useEffect(() => {
    const div = divUnderMessages.current;
    console.log('selected user id in useEffect',selectedUserId)
    if (selectedUserId) {

      axios.get(`https://alumni-backend-chi.vercel.app/messages/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }).then(res => {
        setMessages(res.data);
      })
    }

  }, [selectedUserId])


  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[profile._id]


  const messagesWithoutDupes = uniqBy(messages, '_id')

  const formatCreatedAt = (createdAt) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const timeString = new Date(createdAt).toLocaleTimeString(undefined, options);
    const dateString = new Date(createdAt).toLocaleDateString();
  
    return `${timeString} ${dateString}`;
  };



  return (
    <div style={{ height: '92vh', display: 'flex', width: '61%', flexDirection: 'row', backgroundColor: 'aquamarine' }}>
      <div style={{ backgroundColor: '#919294', width: '25%' }}>
        <Logo />
        {Object.keys(onlinePeopleExclOurUser).map(userId => (
          <Contact
            key={userId}
            id={userId}
            online={true}
            username={onlinePeopleExclOurUser[userId]}
            onClick={() => {
              setSelectedUserId(userId)
            }}
            selected={userId === selectedUserId}
          />
        ))}
        {Object.keys(offlinePeople).map(userId => (
          <Contact
            key={userId}
            id={userId}
            online={false}
            username={offlinePeople[userId].firstName}
            onClick={() => {
              setSelectedUserId(userId)              
            }}
            selected={userId === selectedUserId}
          />
        ))}

        {/* <button onClick={Lout}> Go Offline </button> */}
      </div>
      <div style={{ backgroundColor: 'dodgerblue', width: '75%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: '#c3eefa', height: '90%' }}>
          {!selectedUserId && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Select a person from the sidebar</div>
          )}
          {!!selectedUserId && (
            <div style={{ position: 'relative', height: '100%' }}>
              <div style={{ position: 'absolute', overflowY: 'scroll', height: '100%', width: '100%' }}>
                {messagesWithoutDupes.map(message => (
                  <div key={message._id} style={{ textAlign: (message.sender === profile._id ? 'right' : 'left') }}>
                    <div className={"" + (message.sender === profile._id ? 'myChat' : 'yourChat')} style={{ textAlign: 'left', borderRadius: '6px', padding: '10px', margin: '5px' }}>
                      {message.text}{formatCreatedAt(message.createdAt)}
                      {console.log('messagee',message)}
                      {message.file && (
                        <div style={{fontSize: '14px',display: 'flex', alignItems: 'center'}}>
                          <AiOutlinePaperClip/>
                          <a href={`https://alumni-backend-chi.vercel.app/uploads/${message.file}`} target="_blank" rel="noopener noreferrer">{message.file}</a>
                      </div>
                      )
                      }
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>

          )}
        </div>
        {!!selectedUserId && (
          <div style={{ backgroundColor: 'floralwhite', height: '10%', width: '100%' }}>
           { blockedByUsers.includes(selectedUserId)?(
           <div>The user has blocked you.Learn <a href='#'>more</a></div>):blockedUsers.includes(selectedUserId) ? (<div>You have blocked this user.Unblock to continue chat</div>) : (
           <form style={{ height: '100%',display: 'flex',alignItems: 'center',gap: '0.5vw' }} onSubmit={sendMessage}>
              <input value={newMessageText} onChange={ev => setNewMessageText(ev.target.value)} type="text" style={{ height: '100%', width: '85%' }}></input>
              <label style={{padding: '10px',backgroundColor: '#e3e5e8', border: 'none',borderRadius: '10%',cursor: 'pointer'}}>
                <input type="file" style={{display: 'none'}} onChange={sendFile}/>
                <AiOutlinePaperClip style={{color: 'grey'}}/>
              </label>
              <button type="submit" style={{ height: '60%', width: '15%',borderRadius: '10%' }}>Send</button>
            </form>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat;