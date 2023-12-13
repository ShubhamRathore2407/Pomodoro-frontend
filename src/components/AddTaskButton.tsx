import styled from 'styled-components';

import { AddCircleOutline } from '@mui/icons-material';

const AddTaskButton = () => {
  return (
    <AddTaskWrapper data-testid='add-task-button'>
      <AddCircleOutline
        style={{
          marginRight: '5px',
          fontSize: '30px',
        }}
      />
      Add Task
    </AddTaskWrapper>
  );
};

const AddTaskWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-family: 'Comic Neue', cursive;
`;

export default AddTaskButton;
