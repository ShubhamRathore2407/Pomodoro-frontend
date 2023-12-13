import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../helper/axiosConfig';

const initialUserState = {
  username: '',
  userId: '',
};

const baseURL = 'http://localhost:5000/api/auth';

export const fetchUserData = createAsyncThunk('user/getProfile', async () => {
  const access_token = localStorage.getItem('access_token');
  const response = await axios.get(`${baseURL}/getProfile`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });
  // if (response.data === 'token expired') {
  //   const reResponse = await axios.post(
  //     'http://localhost:5000/api/auth/refreshToken'
  //   );
  //   localStorage.removeItem('access_token');
  //   localStorage.setItem('access_token', reResponse.data.accessToken);
  // }

  return response.data.userData;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await axios.post(`${baseURL}/logout`);
  return response.data;
});

const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialUserState,
  reducers: {
    logout(state) {
      localStorage.removeItem('access_token');
      state.username = '';
      state.userId = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const { username, userId } = action.payload;

      state.username = username;
      state.userId = userId;
    });
  },
});

export const UserSliceActions = userSlice.actions;

export default userSlice.reducer;
