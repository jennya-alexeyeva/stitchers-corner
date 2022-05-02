import {
  FIND_ALL_PATTERNS,
  DELETE_PATTERN,
  CREATE_NEW_PATTERN,
  FAVORITE_PATTERN, UNFAVORITE_PATTERN, UPDATE_PATTERN
} from "../services/pattern-service";

const patternReducer = (state = [], action) => {
  switch (action.type) {
    case FIND_ALL_PATTERNS:
      return action.patterns;
    case DELETE_PATTERN:
      return state.filter(pattern => pattern._id !== action.pattern._id);
    case CREATE_NEW_PATTERN:
      return [
          ...state,
          action.pattern
      ];
    case FAVORITE_PATTERN:
      if (state.some(pattern => pattern._id === action.pattern._id)) {
        return state.map(pattern => pattern._id === action.pattern.id ? action.pattern : pattern);
      } else {
        return [...state, action.pattern];
      }
    case UNFAVORITE_PATTERN:
      return state.map(pattern => pattern._id === action.pattern.id ? action.pattern : pattern);
    case UPDATE_PATTERN:
      return state.map(pattern => pattern._id === action.pattern.id ? action.pattern : pattern);
    default:
      return state;
  }
}

export default patternReducer;