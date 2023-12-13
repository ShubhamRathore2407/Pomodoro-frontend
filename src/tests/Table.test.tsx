import { render, screen } from '@testing-library/react';
import Table from '../components/Table';

test('renders table header correctly', () => {
  render(<Table />);

  const taskHeader = screen.getByText('Task');
  const pomosHeader = screen.getByText('Pomos');
  const statusHeader = screen.getByText('Status');
  const activeHeader = screen.getByText('Active');
  const breakTimeHeader = screen.getByText('Total Break Time (min)');

  expect(taskHeader).toBeDefined();
  expect(pomosHeader).toBeDefined();
  expect(statusHeader).toBeDefined();
  expect(activeHeader).toBeDefined();
  expect(breakTimeHeader).toBeDefined();
});

test('renders table rows correctly', () => {
  render(<Table />);

  const task1Cell = screen.getByText('Task 1');
  const pomos1Cell = screen.getByText('3');
  const status1Cell = screen.getByText('Complete');
  const active1Cell = screen.getByText('No');
  const breakTime1Cell = screen.getByText('15');

  const task2Cell = screen.getByText('Task 2');
  const pomos2Cell = screen.getByText('2');
  const status2Cell = screen.getByText('Incomplete');
  const active2Cell = screen.getByText('Yes');
  const breakTime2Cell = screen.getByText('10');

  expect(task1Cell).toBeDefined();
  expect(pomos1Cell).toBeDefined();
  expect(status1Cell).toBeDefined();
  expect(active1Cell).toBeDefined();
  expect(breakTime1Cell).toBeDefined();

  expect(task2Cell).toBeDefined();
  expect(pomos2Cell).toBeDefined();
  expect(status2Cell).toBeDefined();
  expect(active2Cell).toBeDefined();
  expect(breakTime2Cell).toBeDefined();
});
