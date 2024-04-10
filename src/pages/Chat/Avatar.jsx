import './Avatar.css'

export default function Avatar({userId,username,online}) {
  const colors = ['red','green','purple','blue','yellow','teal'];
    const userIdBase10 = parseInt(userId.substring(10),16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];
  

    return (
      <div className='avatar-container' style={{ backgroundColor: color,position: 'relative'}}>
        <div style={{textAlign: 'center',width: '100%',color: 'white',opacity: '90%'}}>{username[0]}</div>
        {online && (
          <div style={{position: 'absolute', width: '8px', height: '8px', backgroundColor: '#4dfa6d',bottom: '0', right: '0',borderRadius: '50%',border: '0.5px solid white' }}></div>
        )}

        {!online && (
           <div style={{position: 'absolute', width: '8px', height: '8px', backgroundColor: '#bfbcbb',bottom: '0', right: '0',borderRadius: '50%',border: '0.5px solid white' }}></div>
        )}
        
      </div>
    );
  }