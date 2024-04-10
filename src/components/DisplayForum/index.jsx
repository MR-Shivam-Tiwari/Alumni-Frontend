import React from 'react';
import { Link } from 'react-router-dom';

const DisplayForum = ({ forumData, loading, admin }) => {
  console.log('forumData', forumData);
  return (
    <div className='table' style={{ width: '100%' }}>
      <table id='tb' style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>TITLE</th>
            <th>DESCRIPTION</th>
            <th>TOTAL MEMBERS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td>Loading...</td>
            </tr>
          ) : forumData.length ? (
            forumData.map((forum) => (
              <tr key={forum.id}>
                <td>
                  <div>
                    <Link to={`/forums/${forum._id}`} style={{ textDecoration: 'none' }}>
                      <h4 style={{ color: 'black', fontSize: '15px' }}>{forum.title}</h4>
                    </Link>
                  </div>
                </td>
                <td>
                  <div>
                    <p style={{ color: 'black', fontSize: '15px', marginBottom: '0px' }} dangerouslySetInnerHTML={{ __html: forum.description.replace(/<figure.*?<\/figure>/g, '') }}></p>
                  </div>
                </td>
                <td>
                  <div>
                    <h4 style={{ color: 'black', fontSize: '15px' }}>{forum.members.length}</h4>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No forums posted</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayForum;
