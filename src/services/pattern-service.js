import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
const API_PATTERN_URL = `${API_BASE}/api/patterns`;
const API_BOOK_URL = `${API_BASE}/api/books`;

const GOOGLE_BOOKS_API_URL_BASE = "https://www.googleapis.com/books/v1/volumes"

export const FIND_ALL_PATTERNS = 'FIND_ALL_PATTERNS';
export const CREATE_NEW_PATTERN = 'CREATE_NEW_PATTERN';
export const DELETE_PATTERN = 'DELETE_PATTERN';
export const FAVORITE_PATTERN = 'FAVORITE_PATTERN';
export const UNFAVORITE_PATTERN = 'UNFAVORITE_PATTERN';
export const UPDATE_PATTERN = 'UPDATE_PATTERN';

export const findAllPatternsForSearch = async (dispatch, keywords, filter) => {
  let localResponse = await axios.get(`${API_PATTERN_URL}?keywords=${keywords ?? ""}`);
  const localValues = localResponse.data.map(pattern => {
    return {...pattern, external: false}
  });
  let externalResponse = await axios.get(`${GOOGLE_BOOKS_API_URL_BASE}?q=${keywords ?? ""}%20subject:"cross%20stitch"`);
  let externalValues = externalResponse.data.items?.map(book => {
    return {
      title: book.volumeInfo.title ?? "Unknown Title",
      author: book.volumeInfo.authors?.join(", ") ?? "Unknown Author",
      image: book.volumeInfo.imageLinks?.thumbnail,
      price: book.saleInfo.saleability === "FOR_SALE" ? book.saleInfo.retailPrice.amount : "N/A",
      external: true,
      _id: book.id
    }
  }) ?? [];

  externalValues = await Promise.all(externalValues.map(async book => {
    let databaseResp = await axios.get(`${API_BOOK_URL}/${book._id}`);
    const bookFromDatabase = databaseResp.data;
    if (bookFromDatabase) {
      return {...book, favoritedUsers: bookFromDatabase.favoritedUsers}
    } else {
      return book;
    }
  }));

  let returnedPatterns;

  switch(filter) {
    case "external":
      returnedPatterns = externalValues;
      break;
    case "internal":
      returnedPatterns = localValues;
      break;
    default:
      returnedPatterns = localValues.concat(externalValues);
      break;
  }

  dispatch({
    type: FIND_ALL_PATTERNS,
    patterns: returnedPatterns
  })
}

export const findAllPatternsForProfile = async (dispatch) => {
  let localResponse = await axios.get(`${API_PATTERN_URL}`);
  const localValues = localResponse.data.map(pattern => {
    return {...pattern, external: false}
  });
  let externalResponse = await axios.get(`${API_BOOK_URL}`);
  const externalValues = externalResponse.data.map(pattern => {
    return {...pattern, external: true}
  })

  dispatch({
    type: FIND_ALL_PATTERNS,
    patterns: localValues.concat(externalValues)
  })
}

export const createPattern = async (dispatch, pattern) => {
  const response = await axios.post(API_PATTERN_URL, pattern);
  dispatch({
    type: CREATE_NEW_PATTERN,
    pattern: response.data
  })
}

export const deletePattern = async (dispatch, pattern) => {
  await axios.delete(`${API_PATTERN_URL}/${pattern._id}`);
  dispatch({
    type: DELETE_PATTERN,
    pattern
  })
}

export const findPatternById = async (id) => {
  const response = await axios.get(`${API_PATTERN_URL}/${id}`);
  return response.data;
}

export const findBookByIdFromGoogleApi = async (id) => {
  const response = await axios.get(`${GOOGLE_BOOKS_API_URL_BASE}/${id}`);
  return response.data;
}

export const findBookByIdFromDatabase = async (id) => {
  const response = await axios.get(`${API_BOOK_URL}/${id}`);
  return response.data;
}

export const favoritePattern = async (dispatch, user, pattern, external) => {
  const response = await axios.post(`${external ? API_BOOK_URL : API_PATTERN_URL}/favorites`, {user: user, pattern: pattern});
  dispatch({
    type: FAVORITE_PATTERN,
    pattern: response.data
  });
}

export const unfavoritePattern = async (dispatch, user, pattern, external) => {
  const response = await axios.post(`${external ? API_BOOK_URL : API_PATTERN_URL}/unfavorite`, {user: user, pattern: pattern});
  dispatch({
    type: UNFAVORITE_PATTERN,
    pattern: response.data
  });
}

export const updatePattern = async (dispatch, pattern) => {
  const response = await axios.put(`${API_PATTERN_URL}/update/${pattern._id}`, pattern);
  dispatch({
    type: UPDATE_PATTERN,
    pattern: response.data
  })
}