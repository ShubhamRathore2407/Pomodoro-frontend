import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { TaskInterface } from '../types';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImportExportIcon from '@mui/icons-material/ImportExport';

const ProgressBar = ({
  taskList,
  handleClearFinishedTasks,
}: {
  taskList: TaskInterface[];
  handleClearFinishedTasks: () => void;
}) => {
  const [fill, setFill] = useState<number>(0);
  const [dropClick, setDropClick] = useState<boolean>(false);

  useEffect(() => {
    percent();
  }, [taskList]);

  const dropdownRef: any = useRef(null);
  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropClick(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const percent = () => {
    const length = taskList.length;
    const completed = taskList.filter(
      (task) => task.status === 'Completed'
    ).length;

    setFill((completed * 100) / length);
  };
  return (
    <ProgressBarWrapper>
      <Text>Progress</Text>
      <Container>
        <Contain>
          <BarFill $width={fill} data-testid="bar-fill" />
          <Text>{Math.round(fill) === 0 ? '0' : Math.round(fill)}%</Text>
        </Contain>
        <DropDownWrap onClick={() => setDropClick(!dropClick)}>
          <Button ref={dropdownRef}>
            <MoreVertIcon style={{ fontSize: '23px' }} />
          </Button>
          {dropClick && (
            <DropdownWrapper>
              <DropItems onClick={handleClearFinishedTasks}>
                <DeleteForeverIcon
                  style={{
                    opacity: '0.8',
                    width: '24px',
                    marginRight: '8px',
                  }}
                />{' '}
                Clear finished tasks
              </DropItems>
              <DropItems>
                <ImportExportIcon
                  style={{
                    opacity: '0.8',
                    width: '24px',
                    marginRight: '8px',
                  }}
                />{' '}
                Import from Todolist
              </DropItems>
              <DivideLine />
              <DropItems>
                {' '}
                <DeleteForeverIcon
                  style={{
                    opacity: '0.8',
                    width: '24px',
                    marginRight: '8px',
                  }}
                />{' '}
                Clear all tasks
              </DropItems>
            </DropdownWrapper>
          )}
        </DropDownWrap>
      </Container>
    </ProgressBarWrapper>
  );
};

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 60px;
  border-radius: 15px;
  margin-top: 20px;
`;
const BarFill = styled.div<{ $width: number }>`
  height: 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.6);
  width: ${(props) => props.$width}%;
  transition: width 0.4s;
`;
const Text = styled.p`
  color: white;
  width: 45px;
  margin-left: 5px;
  font-size: 20px;
  font-family: 'Comic Neue';
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const Contain = styled.div`
  display: flex;
  align-items: center;
  width: 435px;
  flex: 1;
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.9;
  background: none rgba(255, 255, 255, 0.2);
  box-shadow: none;
  margin-left: 10px;
  font-size: 13px;
  padding: 5px;
  min-width: auto;
  border: none;
  color: white !important;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;
const DropdownWrapper = styled.div`
  border-radius: 4px;
  opacity: 1;
  padding: 4px 0px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 3px 6px;
  display: block;
  pointer-events: auto;
  position: absolute;
  background-color: white;
  transform: translateY(10px);
  width: 210px;
  right: 0px;
  z-index: 100;
  font-family: Roboto;
`;
const DropDownWrap = styled.div`
  position: relative;
`;
const DivideLine = styled.div`
  height: 1px;
  width: 85%;
  background-color: rgb(239, 239, 239);
  margin: auto;
`;
const DropItems = styled.div`
  color: rgb(79, 43, 45);
  display: flex;
  align-items: center;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;
export default ProgressBar;
