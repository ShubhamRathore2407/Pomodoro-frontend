import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Timer from '../components/Timer';
import Header from '../components/Header';
import AddTaskButton from '../components/AddTaskButton';
import AddTaskInput from '../components/AddTaskInput';
import Task from '../components/Task';
import ProgressBar from '../components/ProgressBar';
import Analytics from '../components/Analytics';

import { RootState, TaskInterface } from '../types';
import { fetchAllTasks } from '../store/TaskListSlice';

const Home: React.FC = () => {
  const taskList = useSelector((state: RootState) => state.taskList.tasks);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [addingTask, setAddingTask] = useState<boolean>(false);
  const [timerStart, setTimerStart] = useState<boolean>(false);
  const [timerPause, setTimerPause] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState({
    minutes: 25,
    seconds: 0,
  });

  const dispatch = useDispatch();
  const user_id = useSelector((state: any) => state.user.userId);
  useEffect(() => {
    const obj = {
      user_id,
    };
    if (user_id) {
      //@ts-ignore
      dispatch(fetchAllTasks(obj) as any);
    }
  }, [user_id]);

  const selectedIntervalColor = useSelector(
    (state: RootState) => state.interval.interval.color
  );
  const selectedInterval = useSelector(
    (state: RootState) => state.interval.interval
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleAddTask = () => {
    setAddingTask(true);
    setEditingTaskId(null);
    const div = bottomRef.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  const handleReset = () => {
    setTimerStart(false);
    setTimerPause(true);
    setState({
      minutes: selectedInterval.min,
      seconds: selectedInterval.sec,
    });
  };
  const filteredTaskList = taskList.filter((task: any) => {
    return task.deleted !== true;
  });

  return (
    <Section $selectedIntervalColor={selectedIntervalColor}>
      <Wrapper>
        {/* Header */}
        <HeaderComponent data-testid="header-component">
          <Header setOpen={setOpen} />
        </HeaderComponent>

        {/* Timer */}
        <TimerComponent data-testid="timer-component">
          <Gap />
          <Timer
            setState={setState}
            state={state}
            setTimerStart={setTimerStart}
            timerStart={timerStart}
            setTimerPause={setTimerPause}
            timerPause={timerPause}
            handleReset={handleReset}
          />
        </TimerComponent>

        {/* Progress Bar */}
        {filteredTaskList && filteredTaskList.length > 0 && (
          <ProgressBarComponent data-testid="progress-bar">
            <ProgressBar taskList={filteredTaskList} />
          </ProgressBarComponent>
        )}

        {/* Task List */}
        <TaskListComponent data-testid="task-list-component">
          {filteredTaskList &&
            filteredTaskList.length > 0 &&
            Array.isArray(filteredTaskList) &&
            filteredTaskList.map((task: TaskInterface) =>
              editingTaskId === task?._id ? (
                <AddTaskInput
                  data-testid="edit-task-component"
                  setTimerPause={setTimerPause}
                  key={task._id}
                  setAddingTask={setAddingTask}
                  taskId={task._id}
                  text={task.text}
                  notes={task.notes}
                  setEditingTaskId={setEditingTaskId}
                />
              ) : (
                <Task
                  data-testid="task-list-item"
                  key={task._id}
                  taskId={task._id}
                  text={task.text}
                  notes={task.notes}
                  status={task.status}
                  isActive={task.isActive}
                  timerPause={timerPause}
                  timerStart={timerStart}
                  setTimerPause={setTimerPause}
                  setEditingTaskId={setEditingTaskId}
                  setAddingTask={setAddingTask}
                />
              )
            )}
        </TaskListComponent>

        {/* Add Task Button & Task Input */}
        {!addingTask ? (
          <AddTaskComponent
            onClick={handleAddTask}
            data-testid="add-task-button-component"
          >
            <AddTaskButton />
          </AddTaskComponent>
        ) : (
          <AddTaskInputComp data-testid="add-task-input-component">
            <AddTaskInput
              setAddingTask={setAddingTask}
              setEditingTaskId={setEditingTaskId}
              setTimerPause={setTimerPause}
              taskId={null}
              text=""
              notes=""
            />
          </AddTaskInputComp>
        )}
        <div style={{ height: '100px' }} ref={bottomRef}></div>
      </Wrapper>

      {open && (
        <AnalyticsComponent data-testid="analytics-component">
          <Analytics setOpen={setOpen} />
        </AnalyticsComponent>
      )}
    </Section>
  );
};

const Section = styled.div<{ $selectedIntervalColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 100vh;
  background: ${(props) => props.$selectedIntervalColor};
  overflow: auto;
`;
const AnalyticsComponent = styled.div``;
const ProgressBarComponent = styled.div``;
const AddTaskInputComp = styled.div``;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 10px;
  min-height: 98vh;
  height: auto;
`;

const HeaderComponent = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
`;

const TimerComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 12px;
  margin-top: 10px;
`;

const Gap = styled.div`
  height: 39px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const AddTaskComponent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 470px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  border: 4px dashed rgba(255, 255, 255, 0.3);
  transition: border 0.1s ease-in, color 0.1s ease-in;
  margin-top: 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    border: 4px dashed rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.2);
  }
`;

const TaskListComponent = styled.div`
  display: flex;
  flex-direction: column;
  width: 480px;
  margin-top: 15px;
  height: 50%;
`;

export default Home;

/**
 * analytics
 */

/**
 * fixes & possibles :
 * - switching task while timer is on ------------------------- pass timerPause in Task comp
 * - add indexed DB for users not logged in
 *  - Fix timings of started_at and completed_at
 *
 */
