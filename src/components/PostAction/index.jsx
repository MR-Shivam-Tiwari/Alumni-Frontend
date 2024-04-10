import React from 'react';

import './postAction.scss';

function PostAction({ Icon, title, color }) {
  return (
    <div className='actions'>
      <Icon style={{ color: `${color}` }} />
      <h5>{title}</h5>
    </div>
  );
}

export { PostAction };