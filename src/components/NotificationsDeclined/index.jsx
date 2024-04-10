import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FcApprove, FcDisapprove } from 'react-icons/fc';
import Modal from 'react-bootstrap/Modal';
import '../NotificationsP/notificationsP.css';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Link } from 'react-router-dom';

export const NotificationsDeclined = () => {
  const [notificationList, setNotificationList] = useState([]);
  const profile = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const isAdmin = profile.profileLevel === 0;
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleAddMember = async (notificationId, groupId, memberId, type, toDelete) => {
    setLoading(true);
    try {
      let url = '';
      if (type === 'forum') {
        url = `http://localhost:5000/forums/members/${groupId}`;
      } else if (type === 'group') {
        url = `http://localhost:5000/groups/members/${groupId}`;
      } else if (type === 'ID') {
        url = `http://localhost:5000/alumni/alumni/validateId`;
      } else {
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

  const handleDeleteNotification = async (notificationId) => {
    console.log('notificationId for delete:', notificationId);
    try {
      const response = await axios.delete("http://localhost:5000/alumni/alumni/deleteNotification", {
        data: { notificationId }
      });
      console.log(response.data);
      getRequest();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }
  

  const getRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/groups/requests/req`);
      const filteredData = response.data.filter(notification => notification.status === true);
      setNotificationList(filteredData);
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

  return (
    <div>
      {loading ? (
        <l-line-spinner size="20" stroke="3" speed="1" color="black"></l-line-spinner>
      ) : notificationList.length ? (
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th></th>
              <th style={{color: 'mediumseagreen'}}>ACCEPT</th>
              <th style={{color: 'orangered'}}>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {notificationList.map((notification) => (
              <tr key={notification._id}>
                <td className='request'>
                {notification.ID ? (
                  <div>
                  <Link to={`/members/${notification.userId}`} style={{ textDecoration: 'underline', color: 'inherit' }}>
                      {notification.requestedUserName}
                  </Link> has requested to validate. Click <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleImageClick(notification.ID)}>here</span> to view the identity.
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
                </td>
                <td className='accept'>
                  <FcApprove
                    style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                    onClick={() => handleAddMember(notification._id, notification.forumId || notification.groupId || '', notification.userId, notification.ID ? 'ID' : (notification.forumId ? 'forum' : 'group'), false)}
                  />
                  
                </td>
                <td className='reject'>
                <MdOutlineDeleteOutline
                    style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                    onClick={() => handleDeleteNotification(notification._id)}
                  />
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Declined Notifications</div>
      )}
      <ImagesModal />
    </div>
  );
};
