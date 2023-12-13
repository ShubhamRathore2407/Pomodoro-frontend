import { render, screen } from '@testing-library/react';
import AddTaskButton from '../components/AddTaskButton';

test('Displays Add task Button', async () => {
  render(<AddTaskButton />);

  const buttonComp = await screen.findByTestId('add-task-button');
  console.log(buttonComp);

  expect(buttonComp).toBeDefined();
});
