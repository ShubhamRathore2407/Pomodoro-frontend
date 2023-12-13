import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../helper/axiosConfig';

const innitialPomodoroState = {
  pomodoroId: null,
};
const baseURL = 'http://localhost:5000/api/pomodoro';

export const createPomodoroSession = createAsyncThunk(
  'pomodoro/createPomodoroSession',
  async (obj) => {
    try {
      const response = await axios.post(`${baseURL}/createPomodoro`, obj);
      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deletePomodoro = createAsyncThunk(
  'pomodoro/deletePomodoro',
  async (pomodoroId: any) => {
    try {
      const response = await axios.delete(`${baseURL}/deletePomodoro`, {
        data: { pomodoroId },
      });
      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const endPomodoro = createAsyncThunk(
  'pomodoro/endPomodoro',
  async (obj: any) => {
    try {
      const response = await axios.post(`${baseURL}/endPomodoro`, {
        obj,
      });
      return response.data.message === 'token expired' ? 'token expired' : obj;
    } catch (error) {
      console.log(error);
    }
  }
);

const pomodoroSlice = createSlice({
  name: 'pomodoroSlice',
  initialState: innitialPomodoroState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPomodoroSession.fulfilled, (state, action) => {
      state.pomodoroId = action.payload.pomodoro;
    });
  },
});

export const pomodoroActions = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
