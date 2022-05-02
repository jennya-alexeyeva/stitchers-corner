import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const API_URL = `${API_BASE}/api/users`;

export const findUser = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export const updateUser = async (user) => {
  const response = await axios.put(`${API_URL}/${user._id}`, user);
  return response.data;
}

export const deleteUser = async (user) => {
  const response = await axios.delete(`${API_URL}/${user._id}`);
  return response.data;
}
