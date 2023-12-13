import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Analytics from '../components/Analytics';
import { TaskInterface } from '../types';
import '@testing-library/jest-dom';

const taskList: TaskInterface[] = [
  {
    id: 1,
    text: 'Task 1',
    pomos: 4,
    status: 'Complete',
    totalBreakTime: 240,
    isActive: false,
  },
  {
    id: 2,
    text: 'Task 2',
    pomos: 4,
    status: 'Complete',
    totalBreakTime: 150,
    isActive: false,
  },
  {
    id: 3,
    text: 'Task 3',
    pomos: 4,
    status: 'Pending',
    totalBreakTime: 180,
    isActive: false,
  },
];
const commonProps = {
  taskList: taskList,
  setOpen: jest.fn(),
};
const renderAnalyticsComponent = (props: any) => {
  return render(<Analytics {...props} />);
};

// Display tests
test('Renders Analytics component correctly', () => {
  renderAnalyticsComponent({ ...commonProps });

  // heading
  expect(screen.getByTestId('time-details')).toBeDefined();

  // completed tasks
  expect(screen.getByTestId('completed-tasks')).toBeDefined();
  expect(screen.getByTestId('completed-tasks-completed-in')).toBeDefined();
  expect(screen.getByTestId('completed-tasks-break-time')).toBeDefined();
  expect(screen.getByTestId('completed-tasks-total-time')).toBeDefined();

  // pending tasks
  expect(screen.getByTestId('pending-tasks')).toBeDefined();
  expect(
    screen.getByTestId('pending-tasks-time-worked-till-now')
  ).toBeDefined();
  expect(screen.getByTestId('pending-tasks-break-time-till-now')).toBeDefined();
  expect(screen.getByTestId('pending-tasks-break-time-till-now')).toBeDefined();

  // pending tasks
  expect(screen.getByTestId('final-stats')).toBeDefined();
  expect(screen.getByTestId('final-stats-total-tasks')).toBeDefined();
  expect(screen.getByTestId('final-stats-%tasks-completed')).toBeDefined();
  expect(screen.getByTestId('final-stats-avg-time')).toBeDefined();
});

//Functional tests
test('Handles overlay click', async () => {
  const mockSetOpen = jest.fn();

  renderAnalyticsComponent({ ...commonProps, setOpen: mockSetOpen });

  const analyticsWrapper = screen.getByTestId('analytics-wrapper');

  fireEvent.click(analyticsWrapper);
  await waitFor(() => {
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});

test('Render completed task ListWrapper and its children correctly', () => {
  renderAnalyticsComponent({ ...commonProps });

  const listWrapper = screen.getByTestId('completed-task-list-wrapper');

  expect(listWrapper).toBeDefined();

  const listItems = screen.getAllByTestId('completed-task-list-item');

  expect(listItems).toHaveLength(2); // Update the expected length based on your data

  taskList.forEach((task, index) => {
    if (task.status === 'Complete') {
      const textElement = screen.getByTestId(`text-element-${index}`);
      const timeElement = screen.getByTestId(`time-element-${index}`);
      const breakElement = screen.getByTestId(`break-element-${index}`);
      const totalElement = screen.getByTestId(`total-element-${index}`);

      expect(textElement).toHaveTextContent(task.text);
      expect(timeElement).toHaveTextContent(
        `${Math.round((task.pomos / 2) * 25)} min`
      );
      expect(breakElement).toHaveTextContent(
        `${(task.totalBreakTime / 120).toFixed(2)} min`
      );
      expect(totalElement).toHaveTextContent(
        `${(task.totalBreakTime / 120 + (task.pomos / 2) * 25).toFixed(2)} min`
      );
    }
  });
});

test('Render pending task ListWrapper and its children correctly', () => {
  renderAnalyticsComponent({ ...commonProps });

  const listWrapper = screen.getByTestId('pending-task-list-wrapper');

  expect(listWrapper).toBeDefined();

  const listItems = screen.getAllByTestId('pending-task-list-item');

  expect(listItems).toHaveLength(1); // Update the expected length based on your data

  taskList.forEach((task, index) => {
    if (task.status !== 'Complete') {
      const textElement = screen.getByTestId(`text-element-${index}`);
      const timeElement = screen.getByTestId(`time-element-${index}`);
      const breakElement = screen.getByTestId(`break-element-${index}`);

      expect(textElement).toHaveTextContent(task.text);
      expect(timeElement).toHaveTextContent(
        `${Math.round((task.pomos / 2) * 25)} min`
      );
      expect(breakElement).toHaveTextContent(
        `${(task.totalBreakTime / 120).toFixed(2)} min`
      );
    }
  });
});

test('Renders final stats correctly', () => {
  renderAnalyticsComponent({ ...commonProps });

  const lengthDisplay = screen.getByTestId('final-length');
  const percentDisplay = screen.getByTestId('final-percent');
  const avgDisplay = screen.getByTestId('final-avg');

  expect(lengthDisplay).toHaveTextContent(String(taskList.length));
  expect(percentDisplay).toHaveTextContent(`66%`);
  expect(avgDisplay).toHaveTextContent('50');
});
