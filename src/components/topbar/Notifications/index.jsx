import React from 'react';
import { IoIosNotificationsOff } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FcApprove } from 'react-icons/fc';
import { FcDisapprove } from 'react-icons/fc';
import { lineSpinner } from 'ldrs';
import Modal from 'react-bootstrap/Modal';

lineSpinner.register()



export const Notifications = () => {
  const [notificationList, setNotificationList] = useState([]);
  const profile = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const isAdmin = profile.profileLevel === 0;
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const handleAddMember = async (notificationId, groupId, memberId, type,toDelete) => {
    console.log('not', notificationId, groupId, memberId, type);

    setLoading(true);
    try {
      let url = '';
      if (type === 'forum') {
        url = `http://localhost:5000/forums/members/${groupId}`;
      } else if (type === 'group') {
        url = `http://localhost:5000/groups/members/${groupId}`;
      } else if (type === 'ID') {
        url = `http://localhost:5000/alumni/alumni/validateId`;
      }
      else {
        throw new Error('Invalid type provided');
      }

      const response = await axios.put(url, {
        userId: memberId,
        notificationId: notificationId,
        toDelete
      });

      if (response.status === 200) {
        const { isUserAdded } = response.data;
        setIsAdded(true);
        setLoading(false);
        console.log('User added/removed from the group:', isUserAdded);
      } else {
        console.error('Failed to add/remove user from the group');
      }
    } catch (error) {
      console.error('Error adding/removing user from the group:', error);
    }
  };

  const getRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/groups/requests/req`);
      setNotificationList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching request:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequest();
  }, [isAdded]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImagesModal(true);
  };

  const ImagesModal = () => (
    <Modal
      show={showImagesModal}
      onHide={() => setShowImagesModal(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          View Image
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={selectedImage}
          alt="Selected Image"
          style={{ width: '100%', height: '100%' }}
        />
      </Modal.Body>
    </Modal>
  );



  const filteredNotifications = isAdmin
    ? notificationList
    : notificationList.filter((notification) => notification.ownerId === profile._id);

  console.log('notification list', notificationList)

  return (
    <div>
      {loading ? (
        <l-line-spinner size="20" stroke="3" speed="1" color="black"></l-line-spinner>
      ) : filteredNotifications.length ? (
        <ul style={{ padding: '15px', marginBottom: '0' }}>
          {filteredNotifications.map((notification) => (
            <li key={notification.groupId} style={{ listStyleType: 'none', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '75%' }}>
                {console.log("isAdded", isAdded)}
                {notification.ID ? (
                  <div>
                    {notification.requestedUserName} has requested to validate. Click <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleImageClick(notification.ID)}>here</span> to view the identity.
                  </div>
                ) : (
                  isAdded ? (
                    <div>
                      {notification.requestedUserName} has been added to {notification.groupName ? `${notification.groupName} Group` : `${notification.forumName} forum`}
                    </div>
                  ) : (
                    `${notification.requestedUserName} has requested to join ${notification.groupName ? `${notification.groupName} Group` : `${notification.forumName} forum`}`
                  )
                )}
              </div>
              <div style={{ width: '25%', display: 'flex', justifyContent: 'space-evenly' }}>
                <FcApprove
                  style={{ width: '25px', height: '25px', cursor: 'pointer' }}
                  onClick={() => {
                    const targetId = notification.ID ? 'ID' : (notification.forumId ? 'forum' : (notification.groupId ? 'group' : ''));
                    handleAddMember(notification._id, notification.forumId || notification.groupId || '', notification.userId, targetId,false);
                  }}
                />

                <FcDisapprove style={{ width: '25px', height: '25px', cursor: 'pointer' }}
                  onClick={() => {
                    const targetId = notification.ID ? 'ID' : (notification.forumId ? 'forum' : (notification.groupId ? 'group' : ''));
                    handleAddMember(notification._id,'',notification.userId,targetId,true)
                  }}
                />
              </div>
            </li>
          ))}

        </ul>
      ) : (
        <div>No Notifications</div>
      )}
      <ImagesModal />
    </div>
  );
};
