//this is where we r gonna have react and redux toolkit info, 
// to keep data and components seperate is ideal, sometimes we have to connect them together
import { createSlice } from "@reduxjs/toolkit";

const initialState = { //this state will be stored in a glabal state, this data can be grabbed anywhere from our application
  mode: "light",
  user: null,
  token: null,
  posts: [],
};
//redux concept is such that we can't change state(initialstate here) directly we can only replace the obj as opposed to directly modifying the state, toolkit can act like we modified the state directly[we r referring to state.mode]
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: { //user functions that involve modifying global state
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => { //action alse called payload
      state.user = action.payload.user; //in our payload we are setting user para from this func
      state.token = action.payload.token;
    },
    setLogout: (state) => { //when we hit logout button
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => { //set frineds into local state caz we need to keep this info
      if (state.user) {
        state.user.friends = action.payload.friends; //setting friends in our statements
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => { //we only update the post which matched our id(on which we made changes)
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
