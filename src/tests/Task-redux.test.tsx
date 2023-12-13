import { Provider } from 'react-redux';
import Task from '../components/Task';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import store from '../store/store';
import { taskListActions } from '../store/TaskListSlice';

// Mocking useDispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

// Helper function to render the Task component
const renderTaskComponent = (props: any) => {
  return render(
    <Provider store={store}>
      <Task {...props} />
    </Provider>
  );
};

describe('Task component', () => {
  let mockDispatch: any;

  beforeEach(() => {
    mockDispatch = jest.fn();
    jest.requireMock('react-redux').useDispatch.mockReturnValue(mockDispatch);
  });

  test('Dispatches setActive action on clicking the in-active task', async () => {
    // Arrange
    const commonProps = {
      text: 'Task 1',
      isActive: false,
      taskId: 1,
      status: 'Pending',
      handleReset: jest.fn(),
      setEditingTaskId: jest.fn(),
      setAddingTask: jest.fn(),
    };

    // Act
    renderTaskComponent({ ...commonProps, isActive: true });
    const taskComp = screen.getByTestId('task-component');
    fireEvent.click(taskComp);

    // Assert
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        taskListActions.setActive(commonProps.taskId)
      );
    });
  });

  test('Dispatches setComplete action on clicking the tick icon for a pending task', async () => {
    // Arrange
    const commonProps = {
      text: 'Task 1',
      isActive: false,
      taskId: 1,
      status: 'Pending',
      handleReset: jest.fn(),
      setEditingTaskId: jest.fn(),
      setAddingTask: jest.fn(),
    };

    // Act
    renderTaskComponent({ ...commonProps, taskId: 1 });
    const tickIcon = screen.getByTestId('tick');
    fireEvent.click(tickIcon);

    // Assert
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        taskListActions.setComplete(commonProps.taskId)
      );
    });
  });

  test('Dispatches setInComplete action on clicking the tick icon for a completed task', async () => {
    // Arrange
    const commonProps = {
      text: 'Task 1',
      isActive: false,
      taskId: 1,
      status: 'Complete',
      handleReset: jest.fn(),
      setEditingTaskId: jest.fn(),
      setAddingTask: jest.fn(),
    };

    // Act
    renderTaskComponent({ ...commonProps, taskId: 1 });
    const tickIcon = screen.getByTestId('tick');
    fireEvent.click(tickIcon);

    // Assert
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        taskListActions.setInComplete(commonProps.taskId)
      );
    });
  });
});

// test("Dispatches setStatus action on clicking the tick icon", async () => {
//   renderTaskComponent({ ...commonProps, taskId: 1, isActive: true });

//   const tickIcon = screen.getByTestId("tick");
//   fireEvent.click(tickIcon);

//   // Wait for state updates
//   await act(async () => {
//     await waitFor(() => {
//       // Assert that dispatch was called with the expected action
//       expect(mockDispatch).toHaveBeenCalledWith(
//         expect.objectContaining({
//           payload: commonProps.taskId,
//           type: "taskList/setStatus",
//         })
//       );
//     });
//   });
// });
