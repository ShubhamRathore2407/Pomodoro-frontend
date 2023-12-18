import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskListState } from '../types';
import axios from '../helper/axiosConfig';

const initialTaskListState: TaskListState = {
  tasks: [],
  activeTaskIndex: null,
  activeIndexStatus: 'Pending',
};

// const baseURL = 'http://localhost:5000/api/tasks';

export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAllTasks',
  async (obj: any) => {
    try {
      const response = await axios.post(`/tasks/allTasks`, obj);
      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data.tasks;
    } catch (error) {
      console.log('fetchAllTasks >> ', error);
    }
  }
);
export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (fieldValues, { rejectWithValue }) => {
    try {
      const response = await axios.post(`tasks/addTask`, fieldValues);

      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data.task;
    } catch (error: any) {
      console.error('Error adding new task:', error);
      return rejectWithValue(error.message);
    }
  }
);
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (obj, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/tasks/updateTask`, {
        obj,
      });
      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data.task;
    } catch (error: any) {
      console.error('Error updating task:', error);
      return rejectWithValue(error.message);
    }
  }
);
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      // @ts-ignore
      const response = await axios.delete(`/tasks/deleteTask`, {
        data: { taskId },
      });

      return response.data.message === 'token expired'
        ? 'token expired'
        : taskId;
    } catch (error: any) {
      console.error('Error adding new task:', error);
      return rejectWithValue(error.message);
    }
  }
);
export const startResumeTask = createAsyncThunk(
  'task/startTask',
  async (obj) => {
    try {
      const response = await axios.post(`/tasks/startResumeTask`, obj);
      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data.task;
    } catch (error) {
      console.log(error);
    }
  }
);
export const completeTask = createAsyncThunk(
  'task/completeTask',
  async (obj) => {
    try {
      const response = await axios.post(`/tasks/completeTask`, obj);
      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data.task;
    } catch (error) {
      console.log(error);
    }
  }
);
export const restartTask = createAsyncThunk('task/restartTask', async (obj) => {
  try {
    const response = await axios.post(`/tasks/restartTask`, obj);
    return response.data.message === 'token expired'
      ? 'token expired'
      : response.data.task;
  } catch (error) {
    console.log(error);
  }
});
export const pauseTask = createAsyncThunk(
  'task/pauseTask',
  async (obj, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/tasks/pauseTask`, {
        obj,
      });
      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data.task;
    } catch (error: any) {
      console.error('Error pausing task:', error);
      return rejectWithValue(error.message);
    }
  }
);
export const updateBreakTime = createAsyncThunk(
  'tasks/updateBreakTime',
  async (obj, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/tasks/updateTime`, { obj });
      return response.data.message === 'token expired' ? 'token expired' : obj;
    } catch (error: any) {
      console.error('Error updating break Time:', error);
      return rejectWithValue(error.message);
    }
  }
);
export const deleteCompletedTasks = createAsyncThunk(
  'tasks/deleteCompletedTasks',
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/tasks/deleteCompletedTasks`, {
        data: { userId },
      });

      return response.data.message === 'token expired'
        ? 'token expired'
        : response.data.tasks;
    } catch (error: any) {
      console.error('Error adding new task:', error);
      return rejectWithValue(error.message);
    }
  }
);

const taskListSlice = createSlice({
  name: 'taskList',
  initialState: initialTaskListState,
  reducers: {
    setActive(state, action: PayloadAction<number>) {
      const newIndex = action.payload;
      const oldIndex = state.activeTaskIndex;

      if (oldIndex === null) {
        const updateNewTask = state.tasks.find((task) => task._id === newIndex);

        if (updateNewTask) {
          updateNewTask.isActive = true;
          state.activeTaskIndex = newIndex;
        }
      } else if (newIndex !== oldIndex) {
        const updateOldTask = state.tasks.find((task) => task._id === oldIndex);

        if (updateOldTask) {
          updateOldTask.isActive = false;
          if (updateOldTask.status == 'In Progress') {
            updateOldTask.status = 'Pending';
          }
        }

        const updateNewTask = state.tasks.find((task) => task._id === newIndex);

        if (updateNewTask) {
          updateNewTask.isActive = true;
          if (updateNewTask.status == 'Pending') {
            updateNewTask.status = 'In Progress';
          }
          state.activeTaskIndex = newIndex;
        }
      }
    },
    setComplete(state, action) {
      const index = action.payload;
      const completeTask = state.tasks.find((task) => task._id === index);
      if (completeTask) {
        completeTask.status = 'Completed';
      }
    },
    setInComplete(state, action) {
      const index = action.payload;
      const inCompleteTask = state.tasks.find((task) => task._id === index);
      if (inCompleteTask) {
        inCompleteTask.status = 'Pending';
      }
      state.activeIndexStatus = 'In Progress';
    },
    setStatus(state, action) {
      if (action.payload !== null) {
        const taskId = action.payload;

        const taskIndex = state.tasks.findIndex((task) => task._id === taskId);

        if (taskIndex !== -1) {
          state.activeIndexStatus = state.tasks[taskIndex].status;
        }
      }
    },
    addTaskIdOnPomodoroStart(start, action) {
      const { taskId, pomodoroId } = action.payload;

      const updateTask = start.tasks.find((task) => task._id === taskId);

      if (!updateTask?.pomodoros.includes(pomodoroId)) {
        updateTask?.pomodoros.push(pomodoroId);
      }
    },
    removetaskId(state) {
      console.log('here');

      state.activeTaskIndex = null;
      state.activeIndexStatus = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllTasks.fulfilled, (state: any, action: any) => {
      if (action.payload != null && action.payload !== 'token expired') {
        const sortedTasks = action.payload.sort((a: any, b: any) => {
          const timestampA = a.started_at;
          const timestampB = b.started_at;

          return timestampB - timestampA;
        });

        state.tasks = sortedTasks;
      }
    });
    builder.addCase(addNewTask.fulfilled, (state: any, action: any) => {
      if (action.payload != null && action.payload !== 'token expired') {
        return {
          ...state,
          tasks: [...state.tasks, action.payload],
        };
      }
      return state;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      if (action.payload != null && action.payload !== 'token expired') {
        const input = action.payload.text;
        const notes = action.payload.notes;
        const taskId = action.payload._id;

        const taskIndex = state.tasks.findIndex((task) => task._id === taskId);

        if (taskIndex !== -1) {
          const updatedTask = {
            ...state.tasks[taskIndex],
            text: input,
            notes: notes,
          };
          state.tasks.splice(taskIndex, 1, updatedTask);
        }
      }
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      if (action.payload != null && action.payload !== 'token expired') {
        state.tasks = state.tasks.filter((task) => {
          return task._id !== action.payload;
        });
      }
    });
    builder.addCase(updateBreakTime.fulfilled, (state, action: any) => {
      if (action.payload != null && action.payload !== 'token expired') {
        const { taskId, time } = action.payload;
        console.log(action.payload);

        const taskIndex = state.tasks.findIndex((task) => task._id === taskId);

        if (taskIndex !== -1) {
          const updatedTask = {
            ...state.tasks[taskIndex],
            breakTime: state.tasks[taskIndex].breakTime + time,
          };

          state.tasks.splice(taskIndex, 1, updatedTask);
        }
      }
    });
    builder.addCase(restartTask.fulfilled, (state, action: any) => {
      if (action.payload != null && action.payload !== 'token expired') {
        const { taskId } = action.payload;

        const taskIndex = state.tasks.findIndex((task) => task._id === taskId);

        if (taskIndex !== -1) {
          const updatedTask = {
            ...state.tasks[taskIndex],
            completed_at: null,
            status: 'In Progress',
          };

          state.tasks.splice(taskIndex, 1, updatedTask);
        }
      }
    });
    builder.addCase(startResumeTask.fulfilled, (state, action: any) => {
      if (action.payload != null && action.payload !== 'token expired') {
        const { taskId, pomodoroId } = action.payload;

        const updateTask: any = state.tasks.find((task) => task._id === taskId);
        if (updateTask) updateTask.status = 'In Progress';
        if (!updateTask?.pomodoros.includes(pomodoroId)) {
          updateTask?.pomodoros.push(pomodoroId);
        }
      }
    });
    builder.addCase(deleteCompletedTasks.fulfilled, (state, action) => {
      if (action.payload != null && action.payload !== 'token expired') {
        state.tasks = action.payload;
      }
    });
  },
});

export const taskListActions = taskListSlice.actions;

export default taskListSlice.reducer;
