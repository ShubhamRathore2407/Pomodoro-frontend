import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { TaskInterface } from '../types';

const ProgressBar = ({ taskList }: { taskList: TaskInterface[] }) => {
  const [fill, setFill] = useState<number>(0);

  useEffect(() => {
    percent();
  }, [taskList]);

  const percent = () => {
    const length = taskList.length;
    const completed = taskList.filter(
      (task) => task.status === 'Completed'
    ).length;

    setFill((completed * 100) / length);
  };
  return (
    <ProgressBarWrapper>
      <BarFill $width={fill} data-testid="bar-fill" />
      <Text>{Math.round(fill)}%</Text>
    </ProgressBarWrapper>
  );
};

const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 480px;
  height: 20px;
  border-radius: 15px;
  margin-top: 20px;
`;
const BarFill = styled.div<{ $width: number }>`
  height: 100%;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.6);
  width: ${(props) => props.$width}%;
  transition: width 0.4s;
`;
const Text = styled.p`
  color: white;
  margin-left: 5px;
  font-size: 20px;
  font-family: 'Comic Neue';
`;

export default ProgressBar;
