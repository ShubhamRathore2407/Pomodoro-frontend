import { configureStore } from '@reduxjs/toolkit';

import IntervalSliceReducer from './IntervalSlice';
import TaskListSliceReducer from './TaskListSlice';
import UserSliceReducer from './UserSlice';
import PomodoroReducer from './PomodoroSlice';

const store = configureStore({
  reducer: {
    interval: IntervalSliceReducer,
    taskList: TaskListSliceReducer,
    user: UserSliceReducer,
    pomodoro: PomodoroReducer,
  },
});

export default store;
