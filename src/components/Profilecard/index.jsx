import React, { useState, useEffect } from "react";
import "./profilecard.css";
import picture from "../../images/profilepic.jpg";
import { HiUsers } from "react-icons/hi";
import { IoIosReorder } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { orbit } from 'ldrs';
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";

orbit.register()

const Profilecard = ({ member, name, addButton, groupMembers, owner, deleteButton, handleDelete }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [cookie, setCookie] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true);
  const { _id,id } = useParams();
  let [isAdded, setIsAdded] = useState();
  const profile = useSelector((state) => state.profile);
  let admin;
  if (profile.profileLevel === 0 || profile.profileLevel === 1) {
    admin = true;
  }
  const isFollowPresent = window.location.href.includes('follow');
  console.log('isFollowPresent', isFollowPresent)


  const isGroupURL = window.location.href.includes("http://localhost:3000/groups/");
  const isForumURL = window.location.href.includes("http://localhost:3000/forums/")

  useEffect(() => {
    if (isGroupURL) {
      setIsAdded(groupMembers.includes(member._id));
    }
    else if (isForumURL){
      setIsAdded(groupMembers.includes(member._id));
    }
  }, [isGroupURL, groupMembers, member._id]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/alumni/${profile._id}/following/all`
        );
        const followingDetails = response.data.followingDetails;
        const isUserFollowing = followingDetails.some(
          (detail) => detail.userId === member._id
        );
        setIsFollowing(isUserFollowing);
        setLoading(false);
      } catch (error) {
        console.error("Error checking following status:", error);
      }
    };

    checkFollowingStatus();
  }, [member._id, profile._id, isAdded]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (!isFollowing) {
        await axios.patch(`http://localhost:5000/alumni/${member._id}/follow`, {
          userId: profile._id,
        });
        setIsFollowing(true);
        setLoading(false);
      } else {
        await axios.patch(`http://localhost:5000/alumni/${member._id}/follow`, {
          userId: profile._id,
        });
        setIsFollowing(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      setLoading(false);
    }
  };

  const handleAddMember = async (groupId, memberId) => {
    console.log('handle add ',groupId,memberId)
    setLoading(true)
    try {
      const response = await axios.put(
        `http://localhost:5000/${isGroupURL ? `groups/members/${groupId}` : isForumURL ? `forums/members/${groupId}` : ''}`,
        {
          userId: memberId,
        }
      );
      
      

      if (response.status === 200) {
        const { isUserAdded } = response.data;
        if (isUserAdded === true) {
          setIsAdded(true);
          setLoading(false);
        }
        if (isUserAdded === false) {
          setIsAdded(false);
          setLoading(false);
        }

        console.log('User added/removed to/from the group:', isUserAdded);
      } else {

        console.error('Failed to add/remove user to/from the group');
      }
    } catch (error) {

      console.error('Error adding/removing user to/from the group:', error);
    }
  };

  const isOwner = member._id === owner;

  return (
    <>
      <div
        className="card"
        style={{
          backgroundImage: `url(${picture})`,
          width: "18vw",
          backgroundPosition: "center",
          padding: "10px",
          WebkitBackgroundSize: "cover",
          position: 'relative'
        }}
      >
        {addButton && (
          <button
            onClick={isOwner ? null : () => handleAddMember(_id ? _id: id, member._id)}
            disabled={isOwner}
          >
            {isOwner ? "Group Admin" : isAdded ? "Remove" : <BiUserPlus style={{ fontSize: '17px' }} />}
          </button>
        )}
        {admin && deleteButton && !(profile.profileLevel === 1 && member.profileLevel === 1) && (
          <button onClick={handleDelete}>{member.accountDeleted === true ? 'Restore' : 'Deactivate'}</button>
        )}

        {loading ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <l-orbit
                size="35"
                speed="1.5"
                color="black"
              ></l-orbit>
            </div>
          </>
        ) : (
          name !== "follow" && (
            <button
              onClick={handleFollowToggle}
              style={{ position: 'absolute', right: '5px' }}
            >
              {isFollowing ? "Following" : <> <BiUserPlus style={{ fontSize: "17px" }} /> Follow </>}
            </button>
          )
        )}
        <ul style={{ marginTop: '50px' }}>
          <b>
            <Link
              to={isFollowPresent ? `/members/${member.userId}` : `/members/${member._id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <h3 style={{ paddingTop: "4em", fontWeight: "600" }}>
                {member.firstName}
              </h3>
            </Link>
          </b>
        </ul>
        <ul>
          <HiUsers />
          0 Followers
        </ul>
        <ul>
          <IoIosReorder />
          0 posts
        </ul>
        <ul>
          <MdLocationOn />
          close to you 0.000/k
        </ul>
      </div>
    </>
  );
};

export default Profilecard;
