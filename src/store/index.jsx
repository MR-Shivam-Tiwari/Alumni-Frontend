import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import axios from "axios";
import { useState } from "react";

const savedUser = JSON.parse(localStorage.getItem("user"));


export const fetchMembers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/alumni/all");
    console.log("settings data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return null;
  }
};

export const fetchSettings = async () => {
  try {
    const response = await axios.get("http://localhost:5000/settings/");
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

export const fetchProfileData = async () => {
  try {


    const cookieString = document.cookie;
    

    // const encodedJsonString = cookieString.split('=')[1];
    // const jsonString = decodeURIComponent(encodedJsonString);
    // console.log('json string', jsonString)
    // const startIndex = jsonString.indexOf('{');

    // Extract the substring from the first '{' to the end of the input
    //const jsonString1= jsonString.substring(startIndex);
    //const jsonString1 = jsonString.split(':')[1];
    // console.log('jsonString1', jsonString1)
    // const cookieObject = JSON.parse(jsonString1);

    // Extract the 'id' property from the object
    // const userId = cookieObject.id;
    // const token = cookieObject.token

    const tokenStartIndex = cookieString.indexOf('=');

// Extract the token part
    const jwtToken = cookieString.slice(tokenStartIndex + 1);

    const payloadBase64 = jwtToken.split('.')[1];

// Decode the base64 payload
const decodedPayload = atob(payloadBase64)

// Parse the JSON string
const decodedToken = JSON.parse(decodedPayload);

// Extract the userId
const userId = decodedToken ? decodedToken.userId : null;
const accessToken = jwtToken;
    // const cookies = cookieString.split("; ").reduce((acc, cookie) => {
    //   const [name, value] = cookie.split("=");
    //   acc[name] = value;
    //   return acc;
    // }, {});

    // const accessToken = JSON.parse(decodeURIComponent(cookies["token"])); 
    // console.log('accessToken',accessToken)
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(
      `http://localhost:5000/alumni/${userId}`,
      { headers }
    );
    console.log("profile data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Profile data:", error);
    return null;
  }
};

const initializeStore = async () => {
  try {
    const [initialSettings, initialProfile, initialMembers] = await Promise.all([
      fetchSettings(),
      fetchProfileData(),
      fetchMembers(),
    ]);

    const preloadedState = {
      user: {
        user: savedUser || null,
        isLoggedIn: !!savedUser,
      },
      posts: {
        posts: [],
      },
      settings: initialSettings || {},
      profile: initialProfile || {},
      member: initialMembers || {},
      webSocket: {
        ws: null,
      },
    };

    return configureStore({
      reducer: rootReducer,
      preloadedState,
    });
  } catch (error) {
    console.error("Error initializing store:", error);
    return configureStore({
      reducer: rootReducer,
    });
  }
};

const storePromise = initializeStore();

export default storePromise;