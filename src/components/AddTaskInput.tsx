import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  addNewTask,
  deleteTask,
  taskListActions,
  updateTask,
} from '../store/TaskListSlice';
import axios from 'axios';

const AddTaskInput = ({
  setAddingTask,
  taskId,
  text,
  notes,
  setEditingTaskId,
  setTimerPause,
}: {
  setAddingTask: (addingTask: boolean) => void;
  taskId: number | null;
  text: string;
  notes: string | '';
  setTimerPause: (timerPause: boolean) => void;
  setEditingTaskId: (editingTaskId: number | null) => void;
}) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.user.userId);

  const [inputText, setInputText] = useState('' || text);
  const [inputNotes, setInputNotes] = useState(notes || '');
  const [addNotes, setAddNotes] = useState<boolean>(inputNotes !== '');

  const generateAndSetTokens = async () => {
    const reResponse = await axios.post(
      'http://localhost:5000/api/auth/refreshToken'
    );

    localStorage.removeItem('access_token');
    localStorage.setItem('access_token', reResponse.data.accessToken);
  };
  const handleSaveTask = async () => {
    const fieldValues = {
      user_id: userId,
      text: inputText,
      notes: inputNotes,
    };
    if (fieldValues.text.trim() === '') {
      alert('Task can not be empty');
    } else {
      if (!taskId) {
        // @ts-ignore
        const response = await dispatch(addNewTask(fieldValues) as any);
        if (response.payload === 'token expired') {
          try {
            await generateAndSetTokens();
            // @ts-ignore
            dispatch(addNewTask(fieldValues) as any);
          } catch (error: any) {
            if (error && error.response.status === 403)
              alert('unauthenticated : Token expired');
          }
        }

        setAddingTask(false);
      } else {
        const obj = {
          taskId: taskId,
          fieldValues: fieldValues,
        };
        //@ts-ignore
        const response = await dispatch(updateTask(obj) as any);
        if (response.payload === 'token expired') {
          try {
            await generateAndSetTokens();
            // @ts-ignore
            dispatch(updateTask(obj) as any);
          } catch (error: any) {
            if (error && error.response.status === 403)
              alert('unauthenticated : Token expired');
          }
        }
        setEditingTaskId(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setAddingTask(false);
  };

  const handleDelete = async (taskId: number) => {
    setTimerPause(true);
    dispatch(taskListActions.removetaskId());
    // @ts-ignore
    const response = await dispatch(deleteTask(taskId) as any);
    if (response.payload === 'token expired') {
      try {
        const reResponse = await axios.post(
          'http://localhost:5000/api/auth/refreshToken'
        );
        localStorage.removeItem('access_token');
        localStorage.setItem('access_token', reResponse.data.accessToken);
        // @ts-ignore
        dispatch(deleteTask(taskId) as any);
      } catch (error: any) {
        if (error && error.response.status === 403)
          alert('unauthenticated : Token expired');
      }
    }
  };
  return (
    <AddInputWrapper>
      <Input
        data-testid="input-text"
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="enter your task..."
      />
      <Optionals $addNotes={addNotes}>
        {inputNotes === '' ? (
          !addNotes ? (
            <AddButton onClick={() => setAddNotes(!addNotes)}>
              + Add notes
            </AddButton>
          ) : (
            <NotesTextArea
              value={inputNotes}
              onChange={(e) => setInputNotes(e.target.value)}
            />
          )
        ) : (
          <NotesTextArea
            value={inputNotes}
            onChange={(e) => setInputNotes(e.target.value)}
          />
        )}
        <AddButton onClick={() => setAddNotes(!addNotes)} disabled>
          + Add Project
        </AddButton>
      </Optionals>
      <ButtonGrp>
        <Div>
          {taskId && (
            <Button
              data-testid="delete-button"
              onClick={() => handleDelete(taskId)}
              $color="#808080"
              $bc="#dddddd"
            >
              Delete
            </Button>
          )}
        </Div>
        <Button
          data-testid="cancel-button"
          onClick={handleCancel}
          $color="#808080"
          $bc="#dddddd"
        >
          Cancel
        </Button>
        <Button
          data-testid="save-update-button"
          onClick={handleSaveTask}
          $color="white"
          $bc="#333333"
        >
          {!taskId ? 'Save' : 'Update'}
        </Button>
      </ButtonGrp>
    </AddInputWrapper>
  );
};

const AddInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Comic Neue';
  width: 480px;
  height: auto;
  background: white;
  color: black;
  border: 5px rgba(255, 255, 255, 1);
  margin-top: 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 10px;
`;
const Input = styled.input`
  width: 90%;
  height: 55%;
  border-radius: 10px;
  padding: 20px 10px 0 10px;
  font-size: 20px;
  border: none;

  &:focus {
    outline: none;
    border: none;
  }

  &::placeholder {
    font-size: 22px;
    color: lightgray;
    font-style: italic;
    font-weight: bold;
  }
`;
const ButtonGrp = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  width: 96%;
  height: 45%;
  background: #dddddd;
  border-radius: 0 0 10px 10px;
`;
const Button = styled.button<{ $color: string; $bc: string }>`
  font-size: 14px;
  border: none;
  border-radius: 10px;
  padding: 7px 18px;
  margin-right: 10px;
  color: ${(props) => props.$color};
  background: ${(props) => props.$bc};
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.$bc == '#dddddd' ? '#cccccc' : 'black')};
  }
`;
const Div = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;
const Optionals = styled.div<{ $addNotes: boolean }>`
  width: 90%;
  padding: 20px 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: ${(props) => (props.$addNotes ? 'column' : '')};
`;
const AddButton = styled.button`
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.8;
  font-size: 14px;
  background: none;
  border: none;
  box-shadow: none;
  color: rgba(0, 0, 0, 0.4);
  font-weight: bold;
  letter-spacing: 0.02em;
  text-decoration: underline;

  &:hover {
    opacity: 1;
  }
`;
const NotesTextArea = styled.textarea`
  border-radius: 6px;
  background-color: rgb(239, 239, 239);
  border: none;
  padding: 10px 14px;
  color: rgb(85, 85, 85);
  width: 100%;
  box-sizing: border-box;
  font-size: 15px;
  line-height: 1.4em;
  margin: 8px 0px;
  // display: none;
`;

export default AddTaskInput;
