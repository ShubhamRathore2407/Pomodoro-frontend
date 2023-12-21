import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../helper/axiosConfig';

const initialUserState = {
  username: '',
  userId: '',
  image: '',
};

// const baseURL = 'http://localhost:5000/api/auth';

export const fetchUserData = createAsyncThunk('user/getProfile', async () => {
  const access_token = localStorage.getItem('access_token');
  const response = await axios.get(`/auth/getProfile`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data.message === 'token expired'
    ? 'token expired'
    : response.data.userData;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await axios.post(`auth/logout`);
  return response.data;
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (obj: any, { rejectWithValue }) => {
  try {
    const response = await axios.put('auth/updateProfile', { obj })

    return response.data.message === 'token expired'
      ? 'token expired'
      : response.data.userData;

  } catch (error: any) {
    console.error('Error adding new task:', error);
    return rejectWithValue(error.message);
  }
})

const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialUserState,
  reducers: {
    logout(state) {
      localStorage.removeItem('access_token');
      state.username = '';
      state.userId = '';
      state.image = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const { username, userId, image } = action.payload;

      state.username = username;
      state.userId = userId;
      state.image = image;
    });
  },
});

export const UserSliceActions = userSlice.actions;

export default userSlice.reducer;
