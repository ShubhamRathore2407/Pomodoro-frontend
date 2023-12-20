import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {
  completeTask,
  restartTask,
  taskListActions,
} from '../store/TaskListSlice';

import { RootState } from '../types';
import generateAndSetNewTokens from '../helper/generateAndSetNewTokens';

const Task = React.memo(
  ({
    text,
    taskId,
    status,
    isActive,
    notes,
    timerPause,
    timerStart,
    setTimerPause,
    setEditingTaskId,
    setAddingTask,
  }: {
    text: string;
    status: string;
    taskId: any;
    isActive: boolean;
    notes: string | '';
    timerPause: boolean;
    timerStart: boolean;
    setTimerPause: (timerPause: boolean) => void;
    setEditingTaskId: (editingTaskId: number | null) => void;
    setAddingTask: (addingTask: boolean) => void;
  }) => {
    const dispatch = useDispatch();
    const activeIndex = useSelector(
      (state: RootState) => state.taskList.activeTaskIndex
    );
    const activeStatus = useSelector(
      (state: RootState) => state.taskList.activeIndexStatus
    );
    const pomodoroId = useSelector((state: any) => state.pomodoro.pomodoroId);
    const handleActiveTask = useCallback(() => {
      dispatch(taskListActions.setActive(taskId));
    }, [dispatch, taskId]);

    // Use a useEffect to listen for changes in activeIndex and dispatch setStatus
    useEffect(() => {
      dispatch(taskListActions.setStatus(activeIndex));
    }, [activeIndex]);

    const handleComplete = async () => {
      const currentTime = Date.now();
      if (
        timerStart &&
        timerPause &&
        activeIndex === taskId &&
        activeStatus !== 'Completed'
      ) {
        //Conditions for completing a resumed task
        alert('Resume the Timer to complete Task');
      } else if (activeIndex === taskId) {
        if (status !== 'Completed') {
          if (!pomodoroId) {
            alert('Start timer before Marking task as Done ');
          } else {
            const obj = {
              taskId,
              currentTime,
            };

            //@ts-ignore
            const response = await dispatch(completeTask(obj));
            if (response.payload === 'token expired') {
              try {
                await generateAndSetNewTokens();

                // @ts-ignore
                dispatch(completeTask(obj));
              } catch (error: any) {
                if (error && error.response.status === 403)
                  alert('unauthenticated : Token expired');
                else console.log(error);
              }
              setTimerPause(true);
              dispatch(taskListActions.setComplete(taskId));
            } else {
              if (response?.error) {
                alert("Unauthorized Access: Your credentials are invalid or expired. Please log in again")
              } else {
                setTimerPause(true);
                dispatch(taskListActions.setComplete(taskId));
              }
            }
          }
        } else {
          const obj = {
            taskId,
            currentTime,
          };
          //@ts-ignore
          const response = await dispatch(restartTask(obj));
          if (response.payload === 'token expired') {
            try {
              await generateAndSetNewTokens();

              //@ts-ignore
              dispatch(dispatch(restartTask(obj)));
            } catch (error: any) {
              if (error && error.response.status === 403)
                alert('unauthenticated : Token expired');
              else console.log(error);
            }
          } else if(response?.error) {
             alert("Unauthorized Access: Your credentials are invalid or expired. Please log in again")
          }
          dispatch(taskListActions.setInComplete(taskId));
        }
        dispatch(taskListActions.setStatus(activeIndex));
      } else {
        alert('Select a task to complete');
      }
    };

    const handleEdit = () => {
      setEditingTaskId(taskId);
      setAddingTask(false);
    };

    return (
      <TaskWrapper
        onClick={handleActiveTask}
        $active={isActive}
        data-testid='task-component'
      >
        <LeftBand $active={isActive} data-testid='left-band' />
        <Content>
          <Top>
            <TaskAltRoundedIcon
              data-testid='tick'
              onClick={handleComplete}
              style={{
                fontSize: '30px',
                margin: '0 15px',
                color: `${status === 'Completed' ? '#32CD32' : 'gray'}`,
              }}
            />
            <Text $complete={status === 'Completed'} data-testid='text'>
              {text}
            </Text>
            <KeyboardArrowDownIcon
              onClick={handleEdit}
              style={{ fontSize: '30px', color: 'gray' }}
              data-testid='arrow-dropDown'
            />
          </Top>
          {notes && (
            <Bottom>
              <Notes>{notes}</Notes>
            </Bottom>
          )}
        </Content>
      </TaskWrapper>
    );
  }
);

const LeftBand = styled.div<{ $active: boolean }>`
  position: absolute;
  width: 6px;
  background: ${(props) => props.$active && 'black'};
  height: 100%;
  border-radius: 5px 0 0 5px;
`;
const TaskWrapper = styled.div<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 480px;
  min-height: 50px;
  height: auto;
  background: white;
  margin-top: 15px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: ${(props) =>
    !props.$active ? '0 3px 5px rgba(0, 0, 0, 0.4)' : 'none'};
  transform: ${(props) => (props.$active ? 'scale(0.995)' : 'scale(1)')};
  transition: transform 0.1s ease; /* Add a transition for a smooth effect */
  &:hover ${LeftBand} {
    background: ${(props) => (props.$active ? 'black' : 'lightgray')};
  }
`;
const Text = styled.div<{ $complete: boolean }>`
  letter-spacing: 0.5px;
  font-family: 'Comic Neue';
  font-size: 20px;
  font-weight: bold;
  width: 70%;
  margin-right: 30px;

  word-wrap: break-word; /* Fix the typo here */
  text-decoration: ${(props) => (props.$complete ? 'line-through' : 'none')};
  color: ${(props) => (props.$complete ? 'gray' : 'black')};
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;
const Top = styled.div`
  margin: 20px;
  display: flex;
  align-items: center;
  width: 100%;
`;
const Bottom = styled.div`
  width: 80%;
  margin-bottom: 20px;
  position: relative;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 0px;
  background-color: rgb(252, 248, 222);
`;
const Notes = styled.div`
  // width: 80%;
  font-size: 15px;
  margin-top: 0px;
  margin-bottom: 0px;
  white-space: pre-wrap;
  color: rgb(96, 85, 21);
  padding: 10px 12px;
  word-break: break-word;
`;

export default Task;
