import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddTaskInput from '../components/AddTaskInput';
import { Provider } from 'react-redux';
import store from '../store/store';

const commonProps = {
  taskId: 1,
  text: 'Task 1',
  setAddingTask: jest.fn(),
  setEditingTaskId: jest.fn(),
  generateUniqueId: jest.fn(),
};
const renderAddTaskInputComponent = (props: any) => {
  return render(
    <Provider store={store}>
      <AddTaskInput {...props} />
    </Provider>
  );
};

// Display tests
test('Displays the input field', () => {
  renderAddTaskInputComponent({ ...commonProps });

  const inputComp = screen.getByTestId('input-text');

  expect(inputComp).toBeDefined();
});
test('Displays the delete button', () => {
  renderAddTaskInputComponent({ ...commonProps });

  const inputComp = screen.getByTestId('delete-button');

  expect(inputComp).toBeDefined();
});
test('Displays the cancel button', () => {
  renderAddTaskInputComponent({ ...commonProps });

  const inputComp = screen.getByTestId('cancel-button');

  expect(inputComp).toBeDefined();
});
test('Displays the save/update button', () => {
  renderAddTaskInputComponent({ ...commonProps });

  const inputComp = screen.getByTestId('save-update-button');

  expect(inputComp).toBeDefined();
});

// functional tests
test('Calls a callback to cancel the saving/updating of task by clicking on cancel button', async () => {
  const mockSetEditingTaskId = jest.fn();
  const mockSetAddingTask = jest.fn();

  renderAddTaskInputComponent({
    ...commonProps,
    setEditingTaskId: mockSetEditingTaskId,
    setAddingTask: mockSetAddingTask,
  });

  const cancelButton = await screen.findByTestId('cancel-button');

  fireEvent.click(cancelButton);

  await waitFor(() => {
    expect(mockSetAddingTask).toHaveBeenCalledWith(false);
    expect(mockSetEditingTaskId).toHaveBeenCalledWith(null);
  });
});

test('Calls a callback to save a new task by clicking on save button', async () => {
  const mockSetAddingTask = jest.fn();
  renderAddTaskInputComponent({
    ...commonProps,
    setAddingTask: mockSetAddingTask,
    taskId: null,
  });

  const saveButton = screen.getByTestId('save-update-button');

  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(mockSetAddingTask).toHaveBeenCalledWith(false);
  });
});

test('Calls a callback to update a task by clicking on update button', async () => {
  const mockSetEditingTaskId = jest.fn();
  renderAddTaskInputComponent({
    ...commonProps,
    setEditingTaskId: mockSetEditingTaskId,
  });

  const updateButton = screen.getByTestId('save-update-button');

  fireEvent.click(updateButton);

  await waitFor(() => {
    expect(mockSetEditingTaskId).toHaveBeenCalledWith(null);
  });
});
