import { createSlice } from '@reduxjs/toolkit';

const initialIntervalState = {
  interval: {
    min: 0,
    sec: 5,
    color: '#BA4949',
  },
};

const intervalSlice = createSlice({
  name: 'intervalSlice',
  initialState: initialIntervalState,
  reducers: {
    toggleInterval(state, action) {
      if (action.payload == 'Pomodoro') {
        state.interval = { min: 0, sec: 5, color: '#BA4949' };
      } else if (action.payload == 'Short Break') {
        state.interval = { min: 0, sec: 3, color: '#38858A' };
      } else {
        state.interval = { min: 15, sec: 0, color: '#397097' };
      }
    },
  },
});

export const IntervalSliceActions = intervalSlice.actions;

export default intervalSlice.reducer;
