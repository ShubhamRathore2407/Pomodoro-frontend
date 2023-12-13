import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskListState } from '../types';
import axios from '../helper/axiosConfig';

const initialTaskListState: TaskListState = {
  tasks: [],
  activeTaskIndex: null,
  activeIndexStatus: 'Pending',
};

const baseURL = 'http://localhost:5000/api/tasks';

export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAllTasks',
  async (obj: any) => {
    try {
      const response = await axios.post(`${baseURL}/allTasks`, obj);

      return response.data.tasks;
    } catch (error) {
      console.log('fetchAllTasks >> ', error);
    }
  }
);
export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (fieldValues, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/addTask`, fieldValues);

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
      const response = await axios.put(`${baseURL}/updateTask`, {
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
      const response = await axios.delete(`${baseURL}/deleteTask`, {
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
      const response = await axios.post(`${baseURL}/startResumeTask`, obj);
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
      const response = await axios.post(`${baseURL}/completeTask`, obj);
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
    const response = await axios.post(`${baseURL}/restartTask`, obj);
    return response.data.message === 'token expired'
      ? 'token expired'
      : response.data.task;
  } catch (error) {
    console.log(error);
  }
});
export const pauseTask = createAsyncThunk('task/pauseTask', async (taskId) => {
  try {
    const response = await axios.post(`${baseURL}/pauseTask`, {
      taskId,
    });
    return response.data.message === 'token expired'
      ? 'token expired'
      : response.data.task;
  } catch (error) {
    console.log(error);
  }
});
export const updateBreakTime = createAsyncThunk(
  'tasks/updateBreakTime',
  async (obj, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseURL}/updateTime`, { obj });
      return response.data.message === 'token expired' ? 'token expired' : obj;
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
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
        const arr1 = [...state.tasks];
        console.log(arr1);

        state.tasks = state.tasks.filter((task) => {
          return task._id !== action.payload;
        });
        const arr2 = [...state.tasks];
        console.log(arr2);

        // state.tasks = state.tasks.filter((task) => {
        //   return task._id !== action.payload;
        // });
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
  },
});

export const taskListActions = taskListSlice.actions;

export default taskListSlice.reducer;