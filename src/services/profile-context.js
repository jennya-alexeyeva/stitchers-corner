import React, {useContext, useState} from "react";
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const API_URL = `${API_BASE}/api`;

const api = axios.create({
  withCredentials: true
});

const ProfileContext = React.createContext();

export const ProfileProvider = ({children}) => {
  const [currentProfile, setProfile] = useState();

  const signup = async (user) => {
    try {
      const response = await api.post(`${API_URL}/signup`, user);
      setProfile(response.data);
      return response.data;
    } catch (error) {
      return error.response.status;
    }
  }

  const login = async (user) => {
    try {
      const response = await api.post(`${API_URL}/signin`, user);
      setProfile(response.data);
      return response.data;
    } catch (error) {
      return error.response.status;
    }
  }

  const logout = async () => {
    await api.post(`${API_URL}/logout`);
    setProfile(null);
  }

  const checkLogin = async () => {
    let response;
    try {
      response = await api.post(`${API_URL}/profile`);
      setProfile(response.data);
      return true;
    } catch (error) {
      setProfile(null);
      return false;
    }
  }

  const setUser = async (user) => {
    let response = await api.post(`${API_URL}/updateProfile`, user);
    setProfile(response.data);
    return response.data;
  }

  const value = {logout, login, signup, currentProfile, checkLogin, setUser};

  return (
      <ProfileContext.Provider value={value}>
        {children}
      </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  return useContext(ProfileContext);
}