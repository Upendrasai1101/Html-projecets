// ── postsReducer — useReducer for blog posts state ───────────
// Handles complex state transitions for posts
// Uses: useReducer pattern — action types

// Action types
export const ACTIONS = {
  SET_POSTS:    "SET_POSTS",
  ADD_POST:     "ADD_POST",
  DELETE_POST:  "DELETE_POST",
  LIKE_POST:    "LIKE_POST",
  SET_LOADING:  "SET_LOADING",
  SET_ERROR:    "SET_ERROR",
};

// Initial state
export const initialState = {
  posts:   [],
  loading: false,
  error:   null,
};

// ── Reducer Function ──────────────────────────────────────────
// Pure function — takes state + action, returns new state
// ES6 Arrow Function + ES6 Spread
const postsReducer = (state, action) => {
  switch (action.type) {

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };  // ES6 Spread

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.SET_POSTS:
      return { ...state, posts: action.payload, loading: false };

    case ACTIONS.ADD_POST:
      // ES6 Spread — add new post to beginning of array
      return { ...state, posts: [action.payload, ...state.posts] };

    case ACTIONS.DELETE_POST:
      return {
        ...state,
        // ES6 Arrow Function inside filter
        posts: state.posts.filter((post) => post.id !== action.payload),
      };

    case ACTIONS.LIKE_POST:
      return {
        ...state,
        // ES6 Map + Spread — update likes for specific post
        posts: state.posts.map((post) =>
          post.id === action.payload
            ? { ...post, likes: (post.likes || 0) + 1 }
            : post
        ),
      };

    default:
      return state;
  }
};

export default postsReducer;
