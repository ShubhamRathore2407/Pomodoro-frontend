import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { TaskInterface } from '../types';

const Analytics = ({
  setOpen,
  taskList,
}: {
  setOpen: (open: boolean) => void;
  taskList: TaskInterface[];
}) => {
  const [percentCompleted, setPercentCompleted] = useState<number>(0);
  const [avg, setAvg] = useState<number>(0);
  const handleOverlayClick = () => {
    setOpen(false); // Close the box when clicking outside
  };

  const handleBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    percent();
    avgTime();
  }, [taskList]);

  const percent = () => {
    const length = taskList.length;
    const completed = taskList.filter(
      (task) => task.status === 'Complete'
    ).length;

    setPercentCompleted((completed * 100) / length);
  };

  const avgTime = () => {
    let completedLength = 0;
    let timeForCompleted = 0;
    taskList.forEach((task) => {
      if (task.status === 'Complete') {
        timeForCompleted += (task.pomos / 2) * 25;
        completedLength++;
      }
    });

    setAvg(timeForCompleted / completedLength);
  };

  return (
    <AnalyticsWrapper
      onClick={handleOverlayClick}
      data-testid="analytics-wrapper"
    >
      <Box onClick={handleBoxClick} data-testid="analytics-box">
        {/* Box - Heading */}
        <THeading
          $txtdeco="none"
          $justify="center"
          $fs="30px"
          $color="rgba(0, 0, 0, 0.7)"
          $margin="10px 0"
          data-testid="time-details"
        >
          Time Details
        </THeading>

        {/* Completed Task-heading */}
        <THeading
          $txtdeco="underline"
          $justify="left"
          $fs="18px"
          $color="rgba(0, 0, 0, 0.5)"
          $margin="15px 0 10px"
          data-testid="completed-tasks"
        >
          Completed Tasks
        </THeading>

        {/* Completed Task Table Heading */}
        <TableHeadingWrapper>
          <Heading $justify="left" $w={40} data-testid="completed-tasks-task">
            Task
          </Heading>
          <Heading
            $justify="center"
            $w={20}
            data-testid="completed-tasks-completed-in"
          >
            Completed In
          </Heading>
          <Heading
            $justify="center"
            $w={20}
            data-testid="completed-tasks-break-time"
          >
            Break time
          </Heading>
          <Heading
            $justify="center"
            $w={20}
            data-testid="completed-tasks-total-time"
          >
            Total Time
          </Heading>
        </TableHeadingWrapper>

        {/* Completed Task List */}
        <ListWrapper data-testid="completed-task-list-wrapper">
          {taskList.map(
            (task, index) =>
              task.status === 'Complete' && (
                <ListItem key={task._id} data-testid="completed-task-list-item">
                  <Text $w={40} data-testid={`text-element-${index}`}>
                    {task.text}
                  </Text>
                  <Time $w={20} data-testid={`time-element-${index}`}>
                    {Math.round((task.pomos / 2) * 25)} min
                  </Time>
                  <Break $w={20} data-testid={`break-element-${index}`}>
                    {(task.totalBreakTime / 120).toFixed(2)} min
                  </Break>
                  <Total $w={20} data-testid={`total-element-${index}`}>
                    {(
                      task.totalBreakTime / 120 +
                      (task.pomos / 2) * 25
                    ).toFixed(2)}{' '}
                    min
                  </Total>
                </ListItem>
              )
          )}
        </ListWrapper>

        {/* Pending Task-heading */}
        <THeading
          $txtdeco="underline"
          $justify="left"
          $fs="18px"
          $color="rgba(0, 0, 0, 0.5)"
          $margin="20px 0 10px"
          data-testid="pending-tasks"
        >
          Pending Tasks
        </THeading>

        {/* Pending Task Table Heading */}
        <TableHeadingWrapper>
          <Heading $justify="left" $w={40} data-testid="pending-tasks-task">
            Task
          </Heading>
          <Heading
            $justify="center"
            $w={30}
            data-testid="pending-tasks-time-worked-till-now"
          >
            Time Worked Till Now
          </Heading>
          <Heading
            $justify="center"
            $w={30}
            data-testid="pending-tasks-break-time-till-now"
          >
            Break Time Till Now
          </Heading>
        </TableHeadingWrapper>

        {/* Pending Task List */}
        <ListWrapper data-testid="pending-task-list-wrapper">
          {taskList.map(
            (task, index) =>
              task.status !== 'Complete' && (
                <ListItem key={task._id} data-testid="pending-task-list-item">
                  <Text $w={40} data-testid={`text-element-${index}`}>
                    {task.text}
                  </Text>
                  <Time $w={30} data-testid={`time-element-${index}`}>
                    {(task.pomos / 2) * 25} min
                  </Time>
                  <Break $w={30} data-testid={`break-element-${index}`}>
                    {(task.totalBreakTime / 120).toFixed(2)} min
                  </Break>
                </ListItem>
              )
          )}
        </ListWrapper>

        {/* Final Stats Heading */}
        <THeading
          $txtdeco="underline"
          $justify="left"
          $fs="18px"
          $color="rgba(0, 0, 0, 0.5)"
          $margin="50px 0 10px"
          data-testid="final-stats"
        >
          Final Stats
        </THeading>

        {/* Final Stats Table Heading */}
        <TableHeadingWrapper>
          <Heading
            $justify="center"
            $w={33.3}
            data-testid="final-stats-total-tasks"
          >
            Total Tasks
          </Heading>
          <Heading
            $justify="center"
            $w={33.3}
            data-testid="final-stats-%tasks-completed"
          >
            %Tasks Completed
          </Heading>
          <Heading
            $justify="center"
            $w={33.3}
            data-testid="final-stats-avg-time"
          >
            Avg. Time/Task
          </Heading>
        </TableHeadingWrapper>

        {/* Final Stats List */}
        <ListItem>
          <Data $width="33.3%" data-testid="final-length">
            {taskList.length}
          </Data>
          <Data $width="33.3%" data-testid="final-percent">
            {percentCompleted | 0}%
          </Data>
          <Data $width="33.3%" data-testid="final-avg">
            {avg | 0} min
          </Data>
        </ListItem>
      </Box>
    </AnalyticsWrapper>
  );
};

const AnalyticsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: flex;
  justify-content: center;
`;

const Box = styled.div`
  border-radius: 10px;
  padding: 5px 5px 5px 30px;
  display: flex;
  flex-direction: column;
  margin: 15px;
  background: white;
  width: 40%;
  font-family: 'Comic neue';
  max-height: 100%;
  overflow-y: auto;

  /* Hide the scrollbar for webkit-based browsers (e.g., Chrome) */
  &::-webkit-scrollbar {
    width: 0.5rem; /* Set the width to control the space where the scrollbar would be */
  }

  &::-webkit-scrollbar-thumb {
    background: transparent; /* Make the scrollbar thumb transparent */
  }

  /* Hide the scrollbar for Firefox */
  scrollbar-width: thin; /* "thin" hides the scrollbar */
`;

const THeading = styled.div<{
  $justify: string;
  $fs: string;
  $color: string;
  $txtdeco: string;
  $margin: string;
}>`
  display: flex;
  justify-content: ${(props) => props.$justify};
  font-size: ${(props) => props.$fs};
  font-weight: bold;
  letter-spacing: 1px;
  color: ${(props) => props.$color};
  text-decoration: ${(props) => props.$txtdeco};
  margin: ${(props) => props.$margin};
`;

const Heading = styled.div<{ $w: number; $justify: string }>`
  display: flex;
  justify-content: ${(props) => props.$justify};
  font-size: 20px;
  color: darkgrey;
  width: ${(props) => props.$w}%;
`;

const TableHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  display: flex;
  height: auto;
  margin: 15px 0;
  font-size: 20px;
`;

const Data = styled.div<{ $width: string }>`
  display: flex;
  justify-content: center;
  width: ${(props) => props.$width};
`;

const Text = styled.div<{ $w: number }>`
  word-wrap: break-word;
  width: ${(props) => props.$w}%;
`;

const Time = styled.div<{ $w: number }>`
  display: flex;
  justify-content: center;
  width: ${(props) => props.$w}%;
`;

const Break = styled.div<{ $w: number }>`
  display: flex;
  justify-content: center;
  width: ${(props) => props.$w}%;
`;
const Total = styled.div<{ $w: number }>`
  display: flex;
  justify-content: center;
  width: ${(props) => props.$w}%;
`;

export default Analytics;
