import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { IntervalSliceActions } from '../store/IntervalSlice';
import {
  pauseTask,
  restartTask,
  // restartTask,
  startResumeTask,
  updateBreakTime,
} from '../store/TaskListSlice';
import {
  createPomodoroSession,
  deletePomodoro,
  endPomodoro,
} from '../store/PomodoroSlice';

import { RootState } from '../types';
import { taskListActions } from '../store/TaskListSlice';
import axios from 'axios';

const Timer = ({
  state,
  setState,
  timerStart,
  setTimerStart,
  timerPause,
  setTimerPause,
  handleReset,
}: {
  state: any;
  setState: (state: any) => void;
  timerStart: boolean;
  setTimerStart: (timerStart: boolean) => void;
  timerPause: boolean;
  setTimerPause: (timerPause: boolean) => void;
  handleReset: () => void;
}) => {
  const dispatch = useDispatch();
  const selectedInterval = useSelector(
    (state: RootState) => state.interval.interval
  );
  const pomodoroId = useSelector((state: any) => state.pomodoro.pomodoroId);
  const activeIndex = useSelector(
    (state: RootState) => state.taskList.activeTaskIndex
  );
  // const taskList = useSelector((state: any) => state.taskList.tasks);
  const activeStatus = useSelector(
    (state: RootState) => state.taskList.activeIndexStatus
  );
  const user_id = useSelector((state: any) => state.user.userId);
  const [selectedButton, setSelectedButton] = useState('Pomodoro');
  const [breakStarted, setBreakStarted] = useState(false);

  const allIntervals = {
    Pomodoro: {
      min: 25,
      sec: 0,
    },
    ShortBreak: {
      min: 5,
      sec: 0,
    },
    LongBreak: {
      min: 15,
      sec: 0,
    },
  };

  useEffect(() => {
    setState({
      minutes: selectedInterval.min,
      seconds: selectedInterval.sec,
    });
  }, [selectedInterval]);

  const intervalRef = useRef<any>();

  // Function to update the countdown timer
  const updateTimer = () => {
    const currentTime = Date.now();
    setState((prevState: any) => {
      if (prevState.seconds === 0) {
        if (prevState.minutes === 0) {
          if (
            selectedInterval.min === allIntervals.Pomodoro.min &&
            selectedInterval.sec === allIntervals.Pomodoro.sec
          ) {
            setTimeout(async () => {
              const obj = { pomodoroId, taskId: activeIndex, currentTime };
              const response = await dispatch(
                //@ts-ignore
                endPomodoro(obj)
              );

              if (response.payload === 'token expired') {
                try {
                  await generateAndSetNewTokens();

                  //@ts-ignore
                  dispatch(endPomodoro(obj));
                } catch (error: any) {
                  if (error && error.response.status === 403)
                    alert('unauthenticated : Token expired');
                  else console.log(error);
                }
              }
            }, 100);
          } else if (
            (selectedInterval.min === allIntervals.ShortBreak.min &&
              selectedInterval.sec === allIntervals.ShortBreak.sec) ||
            (selectedInterval.min === allIntervals.LongBreak.min &&
              selectedInterval.sec === allIntervals.LongBreak.sec)
          ) {
            setTimeout(async () => {
              const obj = {
                taskId: activeIndex,
                time: selectedInterval.min * 60 + selectedInterval.sec,
              };

              //@ts-ignore
              const response = await dispatch(updateBreakTime(obj));

              if (response.payload == 'token expired') {
                try {
                  await generateAndSetNewTokens();

                  //@ts-ignore
                  dispatch(updateBreakTime(obj));
                } catch (error: any) {
                  if (error && error.response.status === 403)
                    alert('unauthenticated : Token expired');
                  else console.log(error);
                }
              }
            }, 100);
          }

          sendNotification();
          clearInterval(intervalRef.current);
          handleReset();

          // Return the new state
          return {
            minutes: selectedInterval.min,
            seconds: selectedInterval.sec,
          };
        } else {
          // Return the new state
          return {
            minutes: prevState.minutes - 1,
            seconds: 59,
          };
        }
      } else {
        // Return the new state
        return {
          minutes: prevState.minutes,
          seconds: prevState.seconds - 1,
        };
      }
    });
  };

  //Funtion to send notification
  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      let notification;
      if (
        selectedInterval.min === allIntervals.Pomodoro.min &&
        selectedInterval.sec === allIntervals.Pomodoro.sec
      ) {
        notification = new Notification('Pomodoro Timer', {
          body: "Time's up! Take a break.",
        });
      } else {
        notification = new Notification('Pomodoro Timer', {
          body: "Time's up! Get Back to Working.",
        });
      }
      notification.onclick = () => {
        // window.open("http://localhost:5173");
        console.log('Redirected to http://localhost:5173');
      };
    }
  };

  useEffect(() => {
    if (!timerPause) {
      intervalRef.current = setInterval(updateTimer, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [timerPause, pomodoroId]);

  const handleButtonClick = (buttonText: string) => {
    dispatch(IntervalSliceActions.toggleInterval(buttonText));
    setBreakStarted(buttonText !== 'Pomodoro');
    setTimerStart(false);
    setTimerPause(true);
    setSelectedButton(buttonText);
  };
  const reqToAllowNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    } else {
      // Notifications are not supported
      console.log('Notifications are not supported by this browser.');
    }
  };
  const generateAndSetNewTokens = async () => {
    const reResponse = await axios.post(
      'http://localhost:5000/api/auth/refreshToken'
    );
    localStorage.removeItem('access_token');
    localStorage.setItem('access_token', reResponse.data.accessToken);
  };
  const handleStartClick = async () => {
    const currentTime = Date.now();
    if (
      selectedInterval.min !== allIntervals.Pomodoro.min &&
      activeIndex === null
    ) {
      //Start
      if (!timerStart) {
        setTimerStart(true);
        setTimerPause(false);
      }
      //Pause
      if (timerStart && !timerPause) {
        setTimerPause(true);
      }
      //Resume
      if (timerStart && timerPause) {
        setTimerPause(false);
      }
    } else if (activeIndex) {
      //  Request to allow access to notifications
      reqToAllowNotification();

      if (activeStatus === 'Completed') {
        const res = !timerStart
          ? confirm('Do you want to restart this task?')
          : true;
        if (res) {
          console.log('Start/Resume a completed Task >> ');
          //3 cases - 1) Button text = start(timerStart = false && timerPause = true) 2) Button text = Resume(timerStart = true && timerPause = true) 3)Button text = Resume(timerStart = true && timerPause = false)

          //1st CASE - Button text = Start (timerStart = false && timerPause = true) - Dispatch ->
          if (!timerStart && timerPause) {
            setTimerStart(true);
            setTimerPause(false);
            console.log('Start: restart this task');
          }
          //2nd CASE - Button text = Resume(timerStart = true && timerPause = true)
          if (timerStart && timerPause) {
            setTimerPause(false);
            console.log('Resume: resume this task');
          }
          //3rd CASE - Button text = Pause(timerStart = true && timerPause = false)
          if (timerStart && !timerPause) {
            setTimerPause(true);
            if (!breakStarted) {
              const response = await dispatch(
                //@ts-ignore
                pauseTask(activeIndex)
              );

              if (response.payload === 'token expired') {
                await generateAndSetNewTokens();
                try {
                  await generateAndSetNewTokens();

                  //@ts-ignore
                  dispatch(pauseTask(taskId));
                } catch (error: any) {
                  if (error && error.response.status === 403)
                    alert('unauthenticated : Token expired');
                  else console.log(error);
                }
              }
            }
            console.log('Pause : Pause the Task');
          }
          // Restart a completed task - Dispatch (restartTask) action
          if (!breakStarted) {
            const obj = {
              taskId: activeIndex,
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
            }
            dispatch(taskListActions.setInComplete(activeIndex));
          }
        }
      } else {
        //Three cases - 1) new task to start 2) resume task 3) Pause the task

        //1st CASE - new task to start -> Dispatch - (createPomodoroSession) & (startResumeTask) -> condition - timerStart = false
        if (!timerStart && timerPause) {
          if (!breakStarted) {
            let currPomodoroId: any;
            const obj = {
              taskId: activeIndex,
              user_id,
              currentTime,
            };
            const response = await dispatch(
              //@ts-ignore
              createPomodoroSession(obj)
            );
            if (response.payload === 'token expired') {
              try {
                await generateAndSetNewTokens();
                dispatch(
                  //@ts-ignore
                  createPomodoroSession(obj)
                );
              } catch (error: any) {
                if (error && error.response.status === 403)
                  alert('unauthenticated : Token expired');
                else console.log(error);
              }
            }
            currPomodoroId = response.payload.pomodoro;

            dispatch(
              //@ts-ignore
              startResumeTask({
                taskId: activeIndex,
                pomodoroId: currPomodoroId,
                currentTime,
              })
            );
            dispatch(
              taskListActions.addTaskIdOnPomodoroStart({
                taskId: activeIndex,
                pomodoroId,
              })
            );
          }
          setTimerStart(true);
          setTimerPause(false);
          console.log('Start : start a new task');
        }

        //2nd CASE - resume task - Dispatch - (startResumeTask) -> condition - timerStart = true && timerPause = true
        if (timerStart && timerPause) {
          if (!breakStarted) {
            const obj = { taskId: activeIndex, pomodoroId, currentTime };
            const response = await dispatch(
              //@ts-ignore
              startResumeTask(obj)
            );

            if (response.payload === 'token expired') {
              try {
                await generateAndSetNewTokens();

                dispatch(
                  //@ts-ignore
                  startResumeTask(obj)
                );
              } catch (error: any) {
                if (error && error.response.status === 403)
                  alert('unauthenticated : Token expired');
                else console.log(error);
              }
            }
          }
          setTimerPause(false);
          console.log('Resume : resume an ongoing task');
        }

        //3rd CASE - pause the task - Dispatch - (pasuseTask) -> condotion - timerStart = true && timerPause = false
        if (timerStart && !timerPause) {
          setTimerPause(true);
          if (!breakStarted) {
            const obj = {
              taskId: activeIndex,
              currentTime,
            };
            const response = await dispatch(
              //@ts-ignore
              pauseTask(obj)
            );

            if (response.payload === 'token expired') {
              await generateAndSetNewTokens();
              try {
                await generateAndSetNewTokens();

                //@ts-ignore
                dispatch(pauseTask(obj));
              } catch (error: any) {
                if (error && error.response.status === 403)
                  alert('unauthenticated : Token expired');
                else console.log(error);
              }
            }
          }
          console.log('Pause : Pause the Task');
        }
      }
    } else {
      alert('Select a Task to activate Timer');
    }
  };
  const handleResetTimer = async () => {
    handleReset();
    if (!breakStarted) {
      //@ts-ignore
      const response = await dispatch(deletePomodoro(pomodoroId));

      if (response.payload === 'token expired') {
        try {
          await generateAndSetNewTokens();
          //@ts-ignore
          dispatch(deletePomodoro(pomodoroId));
        } catch (error: any) {
          if (error && error.response.status === 403)
            alert('unauthenticated : Token expired');
          else console.log(error);
        }
      }
    }
  };
  return (
    <TimerWrapper>
      {/* Header Buttons */}
      <ButtonGrp1>
        <Button1
          isselected={selectedButton === 'Pomodoro' ? 'true' : 'false'}
          onClick={() => handleButtonClick('Pomodoro')}
          data-testid="pomodoro-button"
        >
          Pomodoro
        </Button1>
        <Button1
          isselected={selectedButton === 'Short Break' ? 'true' : 'false'}
          onClick={() => handleButtonClick('Short Break')}
          data-testid="short-break-button"
        >
          Short Break
        </Button1>
        <Button1
          isselected={selectedButton === 'Long Break' ? 'true' : 'false'}
          onClick={() => handleButtonClick('Long Break')}
          data-testid="long-break-button"
        >
          Long Break
        </Button1>
      </ButtonGrp1>
      {/*Count Down timer*/}
      <CountDown data-testid="countdown-component">
        {state.minutes}:
        {state.seconds < 10 ? '0' + state.seconds : state.seconds}
      </CountDown>
      {/* Footer Buttons */}
      <ButtonGrp2>
        <ButtonRow1>
          <Button2
            $color={selectedInterval.color}
            onClick={() => handleStartClick()}
            data-testid="start-pause-resume-button"
          >
            {!timerStart ? 'Start' : !timerPause ? 'Pause' : 'Resume'}
          </Button2>
          {timerStart && (
            <Button2
              $color={selectedInterval.color}
              onClick={() => handleResetTimer()}
              data-testid="reset-button"
            >
              Reset
            </Button2>
          )}
        </ButtonRow1>
      </ButtonGrp2>
    </TimerWrapper>
  );
};
const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 480px;
  min-height: 340px;
  max-height: 460px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;

const ButtonGrp1 = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ButtonGrp2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ButtonRow1 = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button1 = styled.button<{ isselected: string }>`
  font-size: 16px;
  background: ${(props) =>
    props.isselected == 'true' ? 'rgba(0, 0, 0, 0.2)' : 'transparent'};
  font-weight: bold;
  letter-spacing: 0.5px;
  color: white;
  padding: 7px;
  border: none;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
  position: relative;
  transition: all 0.01s;

  &:active {
    transform: translateY(3px) translateX(1px);
  }
`;

const Button2 = styled.button<{ $color?: string }>`
  cursor: pointer;
  border: none;
  margin: 20px 0px 0px;
  padding: 0px 12px;
  border-radius: 4px;
  box-shadow: rgb(235, 235, 235) 0px 6px 0px;
  font-size: 22px;
  height: 55px;
  color: ${(props) => props.$color};
  font-weight: bold;
  width: 200px;
  background-color: white;

  &:active {
    transform: translateY(0.5px) translateX(0.5px);
  }
`;

const CountDown = styled.div`
  display: flex;
  justify-content: center;
  // align-items: center;
  color: white;
  font-size: 150px;
  font-family: 'Comic Neue', cursive;
`;

export default Timer;

// what is project about
// what were the earlier phases
// if i can be a part of the team
// when it is going to start
// what should i study before
