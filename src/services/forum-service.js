import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const API_URL = `${API_BASE}/api/forum`;

export const findAllPosts = async (dispatch) => {
  const response = await axios.get(API_URL);
  dispatch({
    type: 'FIND_ALL_POSTS',
    posts: response.data
  })
}

export const createPost = async (dispatch, post) => {
  const response = await axios.post(API_URL, post);
  dispatch({
    type: 'CREATE_NEW_POST',
    post: response.data
  })
}

export const deletePost = async (dispatch, post) => {
  await axios.delete(`${API_URL}/${post._id}`);
  dispatch({
    type: 'DELETE_POST',
    post
  })
}
