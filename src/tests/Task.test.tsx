import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Task from '../components/Task';
import { Provider } from 'react-redux';
import store from '../store/store';
import userEvent from '@testing-library/user-event';

const commonProps = {
  text: 'Task 1',
  isActive: false,
  taskId: 1,
  status: 'Pending',
  handleReset: jest.fn(),
  setEditingTaskId: jest.fn(),
  setAddingTask: jest.fn(),
};

const renderTaskComponent = (props: any) => {
  return render(
    <Provider store={store}>
      <Task {...props} />
    </Provider>
  );
};

// Display Tests
test('Renders the task Component', () => {
  renderTaskComponent({ ...commonProps });

  const taskComp = screen.getByTestId('task-component');
  expect(taskComp).toBeDefined();
});

test('Displays black band on an active task', () => {
  renderTaskComponent({ ...commonProps, isActive: true });

  const taskComp = screen.getByTestId('left-band');
  const color = window.getComputedStyle(taskComp).background;

  expect(color).toBe('black');
});

test('Hides band on in-active Task', () => {
  renderTaskComponent({ ...commonProps, isActive: false });

  const taskComp = screen.getByTestId('left-band');
  const color = window.getComputedStyle(taskComp).background;

  expect(color).toBe('lightgray');
});

test('Displays a green tick on completed task', () => {
  renderTaskComponent({ ...commonProps, status: 'Complete' });

  const tick = screen.getByTestId('tick');
  const color = window.getComputedStyle(tick).color;

  expect(color).toBe('rgb(50, 205, 50)');
});

test('Displays a gray tick on in-complete task', () => {
  renderTaskComponent({ ...commonProps, status: 'Pending' });

  const tick = screen.getByTestId('tick');
  const color = window.getComputedStyle(tick).color;

  expect(color).toBe('gray');
});

test('Displays text', () => {
  renderTaskComponent({ ...commonProps });

  const taskText = screen.getByText('Task 1');

  expect(taskText).toBeDefined();
});

test('Displays DropDown', () => {
  renderTaskComponent({ ...commonProps });

  const downArrow = screen.getAllByTestId('arrow-dropDown');

  expect(downArrow).toBeDefined();
});

//Functionality Tests
test('Drop-down arrow calls the callback on click', async () => {
  const mockSetEditingTaskId1 = jest.fn();
  const mockSetAddingTask = jest.fn();

  renderTaskComponent({
    ...commonProps,
    setEditingTaskId: mockSetEditingTaskId1,
    setAddingTask: mockSetAddingTask,
    taskId: 1,
  });

  const downArrow = screen.getByTestId('arrow-dropDown');

  await userEvent.click(downArrow);

  await waitFor(() => {
    expect(mockSetEditingTaskId1).toHaveBeenCalledWith(1);
    expect(mockSetAddingTask).toHaveBeenCalledWith(false);
  });
});

test('handleReset callback is called on clicking completeTask (tick) icon', async () => {
  const handleResetMock = jest.fn(); // Mocking the handleReset function

  renderTaskComponent({
    ...commonProps,
    isActive: true,
    handleReset: handleResetMock,
  });

  const tickIcon = screen.getByTestId('tick');
  fireEvent.click(tickIcon);

  await waitFor(() => {
    expect(handleResetMock).toHaveBeenCalled();
  });
});
