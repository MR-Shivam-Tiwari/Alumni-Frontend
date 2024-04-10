import React from 'react';
import { useParams } from 'react-router-dom';

export const GroupInvite = () => {
  // Access the groupId from the URL parameters
  const { _id } = useParams();
  const groupId = _id

  // Construct the group invite link
  const groupInviteLink = `${window.location.origin}/groups/${groupId}/invite`;
  console.log('group invite link',groupInviteLink)

  return (
    <div>
      <h2>Group Invite Link</h2>
      <p>
        Share this invite link with others to join the group:
        <br />
        <a href={groupInviteLink}>{groupInviteLink}</a>
      </p>
    </div>
  );
};
