import { useEffect, useState } from 'react';
import styled from 'styled-components';

import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTasks } from '../store/TaskListSlice';
import { RootState } from '../types';

const Analytics = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const dispatch = useDispatch();
  const user_id = useSelector((state: any) => state.user.userId);
  const taskList = useSelector((state: RootState) => state.taskList.tasks);
  useEffect(() => {
    const fetchUserDataFunction = async () => {
      const obj = {
        user_id,
      };
      //@ts-ignore
      const response = await dispatch(fetchAllTasks(obj) as any);
    };

    fetchUserDataFunction();
  }, []);

  const [isActive, setIsActive] = useState<string>('Details');
  const handleOverlayClick = () => {
    setOpen(false); // Close the box when clicking outside
  };

  const handleBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  function formatCreatedAt(dateString: any) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    //@ts-ignore
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  function formatTime(timestamp: any) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  const formattedTaskList = taskList.map((task: any) => ({
    ...task,
    createdAt: formatCreatedAt(task.createdAt),
    started_at: task.started_at !== null ? formatTime(task.started_at) : null,
    completed_at:
      task.completed_at !== null ? formatTime(task.completed_at) : null,
    active_time:
      task.active_time / 1000 < 1 ? 0 : (task.active_time / 1000).toFixed(2),
  }));
  const selectTitle = (title: string) => {
    setIsActive(title);
  };

  return (
    <AnalyticsWrapper
      onClick={handleOverlayClick}
      data-testid="analytics-wrapper"
    >
      <AnalyticsPage>
        <BoxWrapper onClick={handleBoxClick} data-testid="analytics-box">
          <Box>
            <Top>
              <TopTitle
                $isActive={isActive === 'Summary'}
                onClick={() => selectTitle('Summary')}
              >
                Summary
              </TopTitle>
              <TopTitle
                $isActive={isActive === 'Details'}
                onClick={() => selectTitle('Details')}
              >
                Details
              </TopTitle>
            </Top>
            <Bottom>
              <BottomTitleWrapper>
                <BottomTitle>Time Details</BottomTitle>
              </BottomTitleWrapper>
              <BottomListWrapper>
                <ListHeadings>
                  <Headings $width="20%" $tAlign="left">
                    DATE
                  </Headings>
                  <Headings $width="53.5%" $tAlign="left">
                    PROJECT / TASK
                  </Headings>
                  <Headings $width="15%" $tAlign="left">
                    STATUS
                  </Headings>
                  <Headings $width="0" $tAlign="left">
                    MINUTES
                  </Headings>
                </ListHeadings>

                {formattedTaskList.map((task: any) => {
                  return (
                    task.started_at !== null && (
                      <ListItemWrapper>
                        <ListItem>
                          <DateWrapper>
                            <Datee $fWeight="bold" $mt="0">
                              {task.createdAt}
                            </Datee>
                            <Datee $fWeight="normal" $mt="4px">
                              {task.started_at} -{' '}
                              {task.completed_at === null
                                ? ''
                                : task.completed_at}
                            </Datee>
                          </DateWrapper>
                          <ProjectWrapper>
                            <ProjectWrap>
                              <Project>
                                {task.project ? 'task.project' : 'No Project'}
                              </Project>
                            </ProjectWrap>
                            <TaskWrap>
                              <Task>{task.text}</Task>
                            </TaskWrap>
                          </ProjectWrapper>
                          <Status>
                            {task.status === 'Completed' ? 'Done' : 'Not Done'}
                          </Status>
                          <Minutes>{task.active_time}</Minutes>
                          <Actions>
                            <DeleteIcon />
                          </Actions>
                        </ListItem>
                      </ListItemWrapper>
                    )
                  );
                })}
              </BottomListWrapper>
            </Bottom>
          </Box>
        </BoxWrapper>
      </AnalyticsPage>
    </AnalyticsWrapper>
  );
};

const AnalyticsWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  z-index: 2147483647;
  pointer-events: auto;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  transition: all 0.2s ease-in 0s;
  overflow: hidden scroll;
  padding: 48px 0px 58px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
`;
const AnalyticsPage = styled.div`
  color: rgb(34, 34, 34);
  border-radius: 8px;
  background-color: white;
  position: relative;
  max-width: 1000px;
  width: 95%;
  z-index: 2147483647;
  border-top: 1px solid rgb(239, 239, 239);
  border-bottom: 1px solid rgb(239, 239, 239);
  margin: auto;
  transition: all 0.2s ease-in 0s;
  transform: translateY(20px);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 3px 6px;
  overflow: hidden;
  display: block;
`;
const BoxWrapper = styled.div`
  position: relative;
  max-width: 980px;
  margin: auto;
`;
const Box = styled.div`
  padding: 20px;
  position: relative;
`;
const Top = styled.div`
  border: 2px solid rgb(225, 155, 153);
  border-radius: 8px;
  display: flex;
  margin-top: 40px;
  margin-bottom: 40px;
`;
const Bottom = styled.div``;
const TopTitle = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  width: 50%;
  text-align: center;
  padding: 8px 0px;
  font-weight: bold;
  font-size: 16px;
  // border-right: 2px solid rgb(225, 155, 153);

  color: ${(props) => (!props.$isActive ? 'rgb(225, 155, 153)' : 'white')};
  background-color: ${(props) => (props.$isActive ? 'rgb(225, 155, 153)' : '')};
`;
const BottomTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 28px;
  margin-bottom: 28px;
`;
const BottomTitle = styled.div`
  z-index: 1;
  background-color: white;
  padding-right: 12px;
  font-weight: bold;
  color: rgb(87, 87, 87);
  font-size: 18px;
`;
const BottomListWrapper = styled.div`
  position: relative;
  border-bottom: 1px solid rgb(235, 235, 235);
`;
const ListHeadings = styled.div`
  display: flex;
  margin-bottom: 8px;
`;
const Headings = styled.div<{ $width: string; $tAlign: string }>`
  font-size: 12px;
  font-weight: bold;
  color: rgb(163, 163, 163);
  text-transform: uppercase;
  width: ${(props) => props.$width};
  text-align: ${(props) => props.$tAlign};
`;
const ListItemWrapper = styled.div`
  border-top: 1px solid rgb(235, 235, 235);
  padding: 12px 0px;
`;
const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const DateWrapper = styled.div`
  width: 26%;
`;
const ProjectWrapper = styled.div`
  overflow: hidden;
  width: 70%;
  display: flex;
  // justify-content: space-between;
  align-items: center;
`;
const ProjectWrap = styled.div`
  width: 28%;
`;
const Project = styled.div`
  font-size: 13px;
  letter-spacing: 1px;
  border-radius: 4px;
  padding: 8px 10px;
  margin-right: 8px;
  background-color: rgb(240, 240, 240);
  color: rgb(163, 163, 163);
  font-weight: bold;
  display: inline-block;
`;
const Status = styled.div`
  width: 20%;
`;
const Minutes = styled.div`
  width: 10%;
  text-align: left;
`;
const Actions = styled.div`
  width: 5%;
  display: flex;
  justify-content: flex-end;
  position: relative;
`;
const Datee = styled.div<{ $fWeight: string; $mt: string }>`
  color: rgb(187, 187, 187);
  font-weight: ${(props) => props.$fWeight};
  font-size: 14px;
  letter-spacing: 1px;
  margin-top: ${(props) => props.$mt};
`;
const TaskWrap = styled.div`
  width: 60%;
`;
const Task = styled.div`
  overflow: hidden;
  color: rgb(85, 85, 85);
  font-weight: bold;
`;
export default Analytics;
