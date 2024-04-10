import Avatar from "./Avatar.jsx";

export default function Contact({id, username, onClick, selected, online}) {
  return (
    <div
      key={id}
      onClick={() => {
        onClick(id);
        onClick(username);
      }
      }
      className={selected ? 'selected-user' : ''}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1vw',
        padding: '10px',
        width: '100%',
        transition: 'background-color 0.3s', // Add transition for smooth effect
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'lightgray'; // Change background color on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'inherit'; // Revert back to original background color
      }}
    >
      {selected && (
        <div style={{ width: '3px', height: '30px', backgroundColor: 'blanchedalmond' }}></div>
      )}
      <Avatar online={online} username={username} userId={id} />
      <span>{username}</span>
    </div>
  );
}
