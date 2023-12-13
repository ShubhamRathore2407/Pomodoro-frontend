import { Provider } from 'react-redux';
import store from '../store/store';
import AddTaskInput from '../components/AddTaskInput';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { taskListActions } from '../store/TaskListSlice';

// Mocking useDispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

// Helper function to render the AddTaskInput component
const renderAddTaskInputComponent = (props: any) => {
  return render(
    <Provider store={store}>
      <AddTaskInput {...props} />
    </Provider>
  );
};

describe('AddTaskInput component', () => {
  let mockDispatch: any;

  beforeEach(() => {
    mockDispatch = jest.fn();
    jest.requireMock('react-redux').useDispatch.mockReturnValue(mockDispatch);
  });

  test('Dispatches a deleteTask action on clicking delete button', async () => {
    // Arrange
    const commonProps = {
      taskId: 1,
      text: 'Task 1',
      setAddingTask: jest.fn(),
      setEditingTaskId: jest.fn(),
    };

    // Act
    renderAddTaskInputComponent(commonProps);
    const deleteButton = await screen.findByTestId('delete-button');
    fireEvent.click(deleteButton);

    // Assert
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        taskListActions.deleteTask(commonProps.taskId)
      );
    });
  });

  test('Dispatches addTask action on clicking Save button', () => {
    // Arrange
    const commonProps = {
      taskId: null,
      text: '',
      setAddingTask: jest.fn(),
      setEditingTaskId: jest.fn(),
    };

    // Act
    renderAddTaskInputComponent({
      ...commonProps,
    });
    const saveButton = screen.getByTestId('save-update-button');
    fireEvent.click(saveButton);

    // Assert
    expect(mockDispatch).toHaveBeenCalledWith(
      taskListActions.addTask(expect.any(Object))
    );
  });

  test('Dispatches updateTask action on clicking Update button', () => {
    // Arrange
    const commonProps = {
      taskId: 1,
      text: 'new Task',
      setAddingTask: jest.fn(),
      setEditingTaskId: jest.fn(),
    };

    // Act
    renderAddTaskInputComponent({
      ...commonProps,
    });
    const saveButton = screen.getByTestId('save-update-button');
    fireEvent.click(saveButton);

    // Assert
    expect(mockDispatch).toHaveBeenCalledWith(
      taskListActions.updateTask(expect.any(Object))
    );
  });
});
