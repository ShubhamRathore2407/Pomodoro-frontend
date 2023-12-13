import mongoose from 'mongoose';

export interface RootState {
  interval: {
    interval: {
      min: number;
      sec: number;
      color: string;
    };
  };
  taskList: {
    tasks: TaskInterface[];
    activeTaskIndex: number | null;
    activeIndexStatus: string;
  };
}
export interface TaskInterface {
  _id?: number;
  text: string;
  user_id: mongoose.Types.ObjectId;
  isActive: boolean;
  breakTime: number;
  notes: string;
  status: string;
  pomodoros: mongoose.Types.ObjectId[];
  started_at: number | null;
  completed_at: number | null;
}
export interface TimerState {
  minutes: number;
  seconds: number;
}
export interface TaskListState {
  tasks: TaskInterface[];
  activeTaskIndex: number | null;
  activeIndexStatus: string;
}
export interface UserStateInterface {
  username: string;
  userId: string;
}
